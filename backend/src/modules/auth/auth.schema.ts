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
