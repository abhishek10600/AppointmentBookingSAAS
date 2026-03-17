import { emailQueue } from "../../queues/email.queue.js";

export const queueBookingConfirmationEmail = async (bookingId: string) => {
  await emailQueue.add(
    "booking-confirmation",
    { bookingId },
    {
      jobId: `booking-confirmation-${bookingId}`,
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 5000,
      },
      removeOnComplete: true,
    }
  );
};

export const queueBookingCancelEmail = async (bookingId: string) => {
  await emailQueue.add(
    "booking-cancelled",
    { bookingId },
    {
      jobId: `booking-confirmation-${bookingId}`,
      removeOnComplete: true,
    }
  );
};
