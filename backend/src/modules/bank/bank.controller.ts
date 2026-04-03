import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { bankDetailSchema } from "./bank.schema.js";
import {
  getUserBankDetailService,
  upsertBankDetailService,
} from "./bank.service.js";

export const upsertBankDetailController = catchAsync(
  async (req: Request, res: Response) => {
    const parsedData = bankDetailSchema.parse(req.body);
    const userId = req.userId as string;
    const bankDetail = await upsertBankDetailService(userId, parsedData);

    return res.status(201).json({
      success: true,
      data: bankDetail,
    });
  }
);

export const getUserBankDetailController = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.userId as string;

    const bankDetail = await getUserBankDetailService(userId);

    return res.status(200).json({
      success: true,
      data: bankDetail,
    });
  }
);
