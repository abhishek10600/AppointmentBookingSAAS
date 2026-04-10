import { z } from "zod";

export const registerUserSchema = z
  .object({
    name: z.string().min(2, "Name must be atleast 2 characters long"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be atleast 6 characters long"),
  })
  .strict();

export const loginUserSchema = z
  .object({
    email: z.email("Invalid email address"),
    password: z.string().min(1, "Password cannot be empty"),
  })
  .strict();

export const changePasswordSchema = z
  .object({
    oldPassword: z.string("Old password is required"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters long"),
  })
  .strict();

export const forgotPasswordSchema = z
  .object({
    email: z.email("Email is required"),
  })
  .strict();

export const resetPasswordSchema = z
  .object({
    token: z.string("Token is required"),
    newPassword: z
      .string("Password is required")
      .min(6, "Password must be at least 6 characters long"),
  })
  .strict();

export type changePasswordData = z.infer<typeof changePasswordSchema>;
export type forgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type resetPasswordPublicData = z.infer<typeof resetPasswordSchema>;
