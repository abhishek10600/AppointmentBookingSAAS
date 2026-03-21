import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1, "Password cannot be empty."),
});

export type RegisterUserFormData = z.infer<typeof registerSchema>;
export type LoginUserFormData = z.infer<typeof loginSchema>;
