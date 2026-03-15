import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { ApiError } from "../../utils/ApiError.js";
import { getAvailableSlots } from "./slot.service.js";

export const getAvailableSlotsController = catchAsync(
  async (req: Request, res: Response) => {
    const serviceId = req.query.serviceId as string;
    const date = req.query.date as string;

    if (!serviceId || !date) {
      throw new ApiError(400, "ServiceId and date are required.");
    }

    const slots = await getAvailableSlots(serviceId, date);

    return res.status(200).json({
      success: true,
      data: slots,
    });
  }
);
