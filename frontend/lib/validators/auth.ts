import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password cannot be empty."),
});

export const resetPasswordSchema = z
  .object({
    oldPassword: z.string("Old password is required"),
    newPassword: z
      .string("New password is required")
      .min(6, "Password must be at least 6 characters long"),
  })
  .strict();

export type RegisterUserFormData = z.infer<typeof registerSchema>;
export type LoginUserFormData = z.infer<typeof loginSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
