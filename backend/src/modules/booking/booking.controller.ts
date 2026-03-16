import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { createBookingSchema } from "./booking.schema.js";
import {
  cancelBooking,
  createBooking,
  getBooking,
  getOrganizationBookings,
  getServiceBookings,
} from "./booking.service.js";

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

export const cancelBookingController = catchAsync(
  async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId as string;

    const cancelledBooking = await cancelBooking(bookingId);

    return res.status(200).json({
      success: true,
      data: cancelledBooking,
    });
  }
);

export const getBookingController = catchAsync(
  async (req: Request, res: Response) => {
    const bookingId = req.params.bookingId as string;

    const booking = await getBooking(bookingId);

    return res.status(200).json({
      success: true,
      data: booking,
    });
  }
);

export const getOrganizationBookingsController = catchAsync(
  async (req: Request, res: Response) => {
    const organizationId = req.params.organizationId as string;

    const bookings = await getOrganizationBookings(organizationId);

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  }
);

export const getServiceBookingsController = catchAsync(
  async (req: Request, res: Response) => {
    const serviceId = req.params.serviceId as string;

    const bookings = await getServiceBookings(serviceId);

    return res.status(200).json({
      success: true,
      data: bookings,
    });
  }
);
