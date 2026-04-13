import { prisma } from "../../lib/prisma.js";
import { emailQueue } from "../../queues/email.queue.js";
import { ApiError } from "../../utils/ApiError.js";
import { comparePassword, hashPassword } from "../../utils/hash.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefershToken,
} from "../../utils/jwt.js";
import { changePasswordData } from "./auth.schema.js";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const RESET_TOKEN_EXPIRY_MINUTES = 10;

const createRefreshToken = async (userId: string) => {
  const token = generateRefreshToken(userId);
  const expiresAt = new Date();

  expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
};

const buildAuthResponse = (user: {
  id: string;
  name: string;
  email: string;
  role: string;
}) => ({
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
  accessToken: generateAccessToken(user.id),
});

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
    },
  });

  const refreshToken = await createRefreshToken(user.id);

  return { ...buildAuthResponse(user), refreshToken };
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  const isPasswordCorrect = await comparePassword(password, user.passwordHash);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Invalid credentials");
  }

  const refreshToken = await createRefreshToken(user.id);

  return { ...buildAuthResponse(user), refreshToken };
};

export const refreshAccessToken = async (incomingToken: string) => {
  let payload: { userId: string };

  try {
    payload = verifyRefershToken(incomingToken);
  } catch (error) {
    throw new ApiError(401, "Invalid or expired refresh token");
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      token: incomingToken,
    },
    include: {
      user: true,
    },
  });

  if (
    !storedToken ||
    storedToken.isRevoked ||
    storedToken.expiresAt < new Date()
  ) {
    throw new ApiError(401, "Refresh token revoked or expired");
  }

  await prisma.refreshToken.update({
    where: {
      id: storedToken.id,
    },
    data: {
      isRevoked: true,
    },
  });

  const newRefreshToken = await createRefreshToken(storedToken.userId);

  return {
    ...buildAuthResponse(storedToken.user),
    refreshToken: newRefreshToken,
  };
};

export const logoutUser = async (incomingToken: string) => {
  await prisma.refreshToken
    .updateMany({
      where: { token: incomingToken, isRevoked: false },
      data: { revoked: true },
    })
    .catch(() => {});
};

export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return {
    user,
  };
};

export const changePasswordService = async (
  userId: string,
  body: changePasswordData
) => {
  const { oldPassword, newPassword } = body;
  const existingUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  const isOldPasswordCorrect = await comparePassword(
    oldPassword,
    existingUser.passwordHash
  );

  if (!isOldPasswordCorrect) {
    throw new ApiError(400, "Old password incorrect");
  }

  const newPasswordHash = await hashPassword(newPassword);

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      passwordHash: newPasswordHash,
    },
  });

  return {
    success: true,
    message: "Password updated succesfully",
  };
};

export const forgotPasswordService = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return {
      success: true,
      message: "If that email exists, we have sent the reset link in the email",
    };
  }

  await prisma.passwordResetToken.updateMany({
    where: {
      userId: user.id,
      isUsed: false,
    },
    data: {
      isUsed: true,
    },
  });

  const rawToken = crypto.randomBytes(32).toString("hex");

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + RESET_TOKEN_EXPIRY_MINUTES!);

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: rawToken,
      expiresAt,
    },
  });

  const resetLink = `${process.env.CORS_ORIGINS}/auth/reset-password?token=${rawToken}`;

  await emailQueue.add("forgot-password", {
    email: user.email,
    name: user.name,
    resetLink,
  });

  return {
    success: true,
    message: "If that email exists, we have sent a reset link in that email",
  };
};

export const resetPasswordWithTokenService = async (
  token: string,
  newPassword: string
) => {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: {
      token,
    },
    include: {
      user: true,
    },
  });

  if (!resetToken) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  if (resetToken.isUsed) {
    throw new ApiError(400, "Reset yoken already used");
  }

  if (resetToken.expiresAt < new Date()) {
    throw new ApiError(400, "Reset token has expired.");
  }

  const newPasswordHash = await hashPassword(newPassword);

  await prisma.$transaction([
    prisma.user.update({
      where: {
        id: resetToken.userId,
      },
      data: {
        passwordHash: newPasswordHash,
      },
    }),
    prisma.passwordResetToken.update({
      where: {
        id: resetToken.id,
        isUsed: false,
      },
      data: {
        isUsed: true,
      },
    }),
    prisma.refreshToken.updateMany({
      where: {
        userId: resetToken.userId,
        isRevoked: false,
      },
      data: {
        isRevoked: true,
      },
    }),
  ]);

  return {
    success: true,
    message: "Password has been reset successfully",
  };
};
