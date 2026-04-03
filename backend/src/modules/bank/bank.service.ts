import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { encrypt } from "../../utils/encryption.js";
import { createBankDetailData } from "./bank.schema.js";

export const upsertBankDetailService = async (
  userId: string,
  data: createBankDetailData
) => {
  const existing = await prisma.bankDetail.findUnique({
    where: { userId },
  });

  if (existing) {
    const updateData: any = {
      accountHolderName: data.accountHolderName.toLowerCase(),
      ifscCode: data.ifscCode,
      bankName: data.bankName.toLowerCase(),
      bankBranch: data.bankBranch.toLowerCase(),
    };

    if (data.accountNumber) {
      const encrypted = encrypt(data.accountNumber);

      updateData.accountNumberEnc = encrypted.content;
      updateData.accountNumberIv = encrypted.iv;
      updateData.accountNumberTag = encrypted.tag;
      updateData.accountNumberLast4 = data.accountNumber.slice(-4);
    }

    const bankDetail = await prisma.bankDetail.update({
      where: { userId },
      data: updateData,
    });

    return {
      id: bankDetail.id,
      accountHolderName: bankDetail.accountHolderName,
      bankName: bankDetail.bankName,
      bankBranch: bankDetail.bankBranch,
      ifscCode: bankDetail.ifscCode,
      isVerified: bankDetail.isVerified,
      accountNumber: "XXXXXX" + bankDetail.accountNumberLast4,
    };
  }

  if (!data.accountNumber) {
    throw new ApiError(400, "Account number is required");
  }

  const encrypted = encrypt(data.accountNumber);

  const bankDetail = await prisma.bankDetail.create({
    data: {
      userId,
      accountHolderName: data.accountHolderName.toLowerCase(),
      ifscCode: data.ifscCode,
      bankName: data.bankName.toLowerCase(),
      bankBranch: data.bankBranch.toLowerCase(),
      accountNumberEnc: encrypted.content,
      accountNumberIv: encrypted.iv,
      accountNumberTag: encrypted.tag,
      accountNumberLast4: data.accountNumber.slice(-4),
    },
  });

  return {
    id: bankDetail.id,
    accountHolderName: bankDetail.accountHolderName,
    bankName: bankDetail.bankName,
    bankBranch: bankDetail.bankBranch,
    ifscCode: bankDetail.ifscCode,
    isVerified: bankDetail.isVerified,
    accountNumber: "XXXXXX" + bankDetail.accountNumberLast4,
  };
};

export const getUserBankDetailService = async (userId: string) => {
  if (!userId) {
    throw new ApiError(400, "User Id not found");
  }

  const bankDetail = await prisma.bankDetail.findUnique({
    where: {
      userId,
    },
  });

  if (!bankDetail) {
    throw new ApiError(404, "Bank detail not found");
  }

  return {
    id: bankDetail.id,
    accountHolderName: bankDetail.accountHolderName,
    bankName: bankDetail.bankName,
    bankBranch: bankDetail.bankBranch,
    ifscCode: bankDetail.ifscCode,
    isVerified: bankDetail.isVerified,
    accountNumber: "XXXXXX" + bankDetail.accountNumberLast4,
  };
};
