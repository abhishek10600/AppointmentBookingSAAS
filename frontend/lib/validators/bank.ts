import { z } from "zod";

export const bankFormSchema = z.object({
  accountHolderName: z.string().min(1, "Account holder name is required"),
  accountNumber: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .optional(),
  ifscCode: z
    .string()
    .min(1, "Account number is required")
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code"),
  bankName: z.string().min(1, "Bank name is required"),
  bankBranch: z.string().min(1, "Bank branch name"),
});

export type BankFormData = z.infer<typeof bankFormSchema>;
