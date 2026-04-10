import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import {
  loginUserSchema,
  registerUserSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./auth.schema.js";
import {
  getUserById,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  changePasswordService,
  forgotPasswordService,
  resetPasswordWithTokenService,
} from "./auth.service.js";
import { ApiError } from "../../utils/ApiError.js";

export const register = catchAsync(async (req: Request, res: Response) => {
  const data = registerUserSchema.parse(req.body);
  const result = await registerUser(data.name, data.email, data.password);
  return res.status(201).json({
    success: true,
    data: result,
  });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const data = loginUserSchema.parse(req.body);
  const result = await loginUser(data.email, data.password);
  // console.log({ result });
  return res.status(200).json({
    success: true,
    data: result,
  });
});

export const refresh = catchAsync(async (req: Request, res: Response) => {
  const incomingToken = req.body.refreshToken;
  if (!incomingToken) {
    throw new ApiError(401, "No refresh token");
  }

  const { refreshToken, ...result } = await refreshAccessToken(incomingToken);

  return res.status(200).json({
    success: true,
    data: result,
  });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  const incomingToken = req.body.refreshToken;

  if (incomingToken) {
    await logoutUser(incomingToken);
  }

  return res.status(200).json({ success: true, message: "Logged out" });
});

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.userId as string;
  const result = await getUserById(userId);
  return res.status(200).json({
    success: true,
    data: result,
  });
});

export const changePasswordController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.userId as string;
    const parsedBody = changePasswordSchema.parse(req.body);
    const result = await changePasswordService(userId, parsedBody);
    return res.status(200).json({
      data: result,
    });
  }
);

export const forgotPasswordController = catchAsync(
  async (req: Request, res: Response) => {
    const parsedBody = forgotPasswordSchema.parse(req.body);
    const result = await forgotPasswordService(parsedBody.email);
    return res.status(200).json({
      data: result,
    });
  }
);

export const resetPasswordWithTokenController = catchAsync(
  async (req: Request, res: Response) => {
    const parsedBody = resetPasswordSchema.parse(req.body);
    const result = await resetPasswordWithTokenService(
      parsedBody.token,
      parsedBody.newPassword
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  }
);
