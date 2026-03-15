import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import { createBookingData } from "./booking.schema.js";

export const createBooking = async (data: createBookingData) => {
  const service = await prisma.service.findUnique({
    where: {
      id: data.serviceId,
    },
  });

  if (!service) {
    throw new ApiError(404, "Service not found");
  }

  if (!service.isActive) {
    throw new ApiError(400, "Service is not active");
  }

  const startTime = new Date(data.startTime);
  const endTime = new Date(
    startTime.getTime() + service.durationInMinutes * 60000
  );

  //   implementing transaction
  const booking = await prisma.$transaction(async (tx) => {
    // check overlapping booking
    const overlappingBooking = await tx.booking.findFirst({
      where: {
        serviceId: data.serviceId,
        status: {
          not: "CANCELLED",
        },
        AND: [
          {
            startTime: {
              lt: endTime,
            },
          },
          {
            endTime: {
              gt: startTime,
            },
          },
        ],
      },
    });

    if (overlappingBooking) {
      throw new ApiError(400, "Time slot already booked");
    }

    // check existing booking lock
    const existingLock = await tx.bookingLock.findFirst({
      where: {
        serviceId: data.serviceId,
        expiresAt: {
          gt: new Date(),
        },
        AND: [
          {
            startTime: {
              lt: endTime,
            },
          },
          {
            endTime: {
              gt: startTime,
            },
          },
        ],
      },
    });

    if (existingLock) {
      throw new ApiError(400, "Slot is temporarily locked");
    }

    const booking = await tx.booking.create({
      data: {
        organizationId: data.organizationId,
        serviceId: data.serviceId,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        startTime,
        endTime,
      },
    });

    return booking;
  });

  return booking;
};
