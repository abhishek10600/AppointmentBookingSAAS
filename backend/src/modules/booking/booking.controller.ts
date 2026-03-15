import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { createBookingSchema } from "./booking.schema.js";
import { createBooking } from "./booking.service.js";

export const createBookingController = catchAsync(
  async (req: Request, res: Response) => {
    const data = createBookingSchema.parse(req.body);

    const booking = await createBooking(data);

    return res.status(201).json({
      success: true,
      data: booking,
    });
  }
);
