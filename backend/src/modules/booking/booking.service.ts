import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import {
  queueBookingCancelEmail,
  queueBookingConfirmationEmail,
} from "../email/email.service.js";
import { queueCreateMeeting } from "../meeting/meeting.service.js";
import { createBookingData } from "./booking.schema.js";
import { cache } from "../../utils/cache.js";

export const createBooking = async (data: createBookingData, tx: any) => {
  const db = tx || prisma;

  const service = await db.service.findUnique({
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

  const overlappingBooking = await db.booking.findFirst({
    where: {
      serviceId: data.serviceId,
      status: {
        not: "CANCELLED",
      },
      AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
    },
  });

  if (overlappingBooking) {
    throw new ApiError(400, "Time slot already booked");
  }

  const booking = await db.booking.create({
    data: {
      organizationId: data.organizationId,
      serviceId: data.serviceId,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      startTime,
      endTime,
    },
    include: {
      service: true,
    },
  });

  if (service.serviceType === "ONLINE") {
    await queueCreateMeeting(booking.id);
  } else {
    await queueBookingConfirmationEmail(booking.id);
  }

  cache.del(`booking:organizationId:${booking.organizationId}`);

  return booking;
};

export const getBooking = async (bookingId: string) => {
  const booking = await prisma.booking.findFirst({
    where: {
      id: bookingId,
    },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  return booking;
};

export const cancelBooking = async (bookingId: string) => {
  const booking = await prisma.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      organization: true,
    },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  const cancelledBooking = await prisma.booking.update({
    where: {
      id: bookingId,
    },
    data: {
      status: "CANCELLED",
    },
  });

  await queueBookingCancelEmail(bookingId);

  await cache.del(`booking:organizationId:${booking.organizationId}`);

  return cancelledBooking;
};

export const getOrganizationBookings = async (organizationId: string) => {
  const cacheKey = `booking:organizationId:${organizationId}`;

  const cached = await cache.get(cacheKey);
  if (cached) {
    console.log("Cache HIT");
    return cached;
  }

  const bookings = await prisma.booking.findMany({
    where: {
      organizationId,
    },
    include: {
      service: true,
    },
    orderBy: {
      startTime: "desc",
    },
  });

  await cache.set(cacheKey, bookings, 300);

  return bookings;
};

export const getServiceBookings = async (serviceId: string) => {
  const bookings = await prisma.booking.findMany({
    where: {
      serviceId,
    },
    orderBy: {
      startTime: "desc",
    },
  });

  return bookings;
};
