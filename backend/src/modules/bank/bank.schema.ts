import { z } from "zod";

export const bankDetailSchema = z
  .object({
    ifscCode: z.string().min(1, "IFSC code cannot be empty"),
    bankName: z.string().min(1, "Bank name cannot be empty"),
    bankBranch: z.string().min(1, "Bank branch cannot be empty"),
    accountNumber: z
      .string()
      .min(1, "Account number cannot be empty")
      .optional(),
    accountHolderName: z.string().min(1, "Account Holder Name is required"),
  })
  .strict();

export type createBankDetailData = z.infer<typeof bankDetailSchema>;
