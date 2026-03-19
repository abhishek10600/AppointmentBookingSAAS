import { tryCatch, Worker } from "bullmq";
import { prisma } from "../lib/prisma.js";
import { resend } from "../lib/email.js";
import {
  bookingCancelledTemplate,
  bookingConfirmationTemplate,
} from "../modules/email/email.template.js";
import { redisConnection } from "../lib/redis.js";
import { deadLetterQueue } from "../queues/dead-letter.queue.js";

new Worker(
  "emailQueue",
  async (job) => {
    try {
      console.log("Processing job:", job.name, job.data);
      const { bookingId } = job.data;

      const booking = await prisma.booking.findUnique({
        where: {
          id: bookingId,
        },
        include: {
          service: true,
        },
      });

      if (!booking) {
        return;
      }

      if (job.name === "booking-confirmation") {
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: booking.customerEmail,
          subject: "Booking Confirmed",
          html: bookingConfirmationTemplate(
            booking.customerName,
            booking.service.title,
            booking.startTime,
            booking.meetingLink
          ),
        });
      }

      if (job.name === "booking-cancelled") {
        await resend.emails.send({
          from: process.env.EMAIL_FROM!,
          to: booking.customerEmail,
          subject: "Booking Cancelled",
          html: bookingCancelledTemplate(
            booking.customerName,
            booking.service.title
          ),
        });
      }
    } catch (error) {
      console.error("Job failed: ", job.id);

      await deadLetterQueue.add("failed-email", {
        jobName: job.name,
        jobData: job.data,
        error: error instanceof Error ? error.message : "Unknown error",
      });

      throw error;
    }
  },
  {
    connection: redisConnection,
    concurrency: 5,
    limiter: {
      max: 10,
      duration: 1000,
    },
  }
);
