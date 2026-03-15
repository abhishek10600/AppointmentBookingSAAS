import { prisma } from "../../lib/prisma.js";
import { ApiError } from "../../utils/ApiError.js";

const timeToMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

export const getAvailableSlots = async (serviceId: string, date: string) => {
  const service = await prisma.service.findUnique({
    where: {
      id: serviceId,
    },
  });

  if (!service) {
    throw new ApiError(404, "Service not found.");
  }

  const dayofWeek = new Date(date).getDay();

  const rule = await prisma.availabilityRule.findFirst({
    where: {
      organizationId: service.organizationId,
      dayofWeek,
    },
  });

  if (!rule) {
    return [];
  }

  const duration = service.durationInMinutes;

  const startMinutes = timeToMinutes(rule.startTime);
  const endMinutes = timeToMinutes(rule.endTime);

  const generatedSlots: string[] = [];

  for (
    let current = startMinutes;
    current + duration <= endMinutes;
    current = current + duration
  ) {
    generatedSlots.push(minutesToTime(current));
  }

  const startOfDay = new Date(`${date}T00:00:00`);
  const endOfDay = new Date(`${date}T23:59:59`);

  const bookings = await prisma.booking.findMany({
    where: {
      serviceId,
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  const bookedTimes = bookings.map((b) =>
    b.startTime.toISOString().slice(11, 16)
  );

  const locks = await prisma.bookingLock.findMany({
    where: {
      serviceId,
      startTime: {
        gte: startOfDay,
        lte: endOfDay,
      },
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  const lockedTimes = locks.map((l) => l.startTime.toISOString().slice(11, 16));

  const unavailableTimes = [...bookedTimes, ...lockedTimes];

  const availableSlots = generatedSlots.filter(
    (slot) => !unavailableTimes.includes(slot)
  );

  return availableSlots;
};
