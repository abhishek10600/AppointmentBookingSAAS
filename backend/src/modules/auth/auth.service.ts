import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { comparePassword, hashPassword } from "../../utils/hash.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefershToken,
} from "../../utils/jwt.js";

const REFRESH_TOKEN_EXPIRY_DAYS = 7;

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
      where: { token: incomingToken, revoked: false },
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
