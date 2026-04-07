import { Worker } from "bullmq";
import { redisConnection } from "../lib/redis.js";
import { prisma } from "../lib/prisma.js";
import { oauth2Client } from "../lib/google.js";
import { google } from "googleapis";
import { deadLetterQueue } from "../queues/dead-letter.queue.js";
import { queueBookingConfirmationEmail } from "../modules/email/email.service.js";

oauth2Client.on("tokens", async (tokens) => {
  if (tokens.access_token && tokens.expiry_date) {
    console.log("Token refreshed");
  }
});

new Worker(
  "meetingQueue",
  async (job) => {
    try {
      const { bookingId } = job.data;

      const booking = await prisma.booking.findUnique({
        where: {
          id: bookingId,
        },
        include: {
          service: true,
          organization: {
            include: {
              googleIntegration: true,
            },
          },
        },
      });

      if (!booking) {
        throw new Error("Booking not found");
      }

      // console.log({ booking });

      const integration = booking.organization.googleIntegration;

      if (!integration) {
        console.log("Google integration not found");
        return;
      }

      // console.log({ integration });

      oauth2Client.setCredentials({
        access_token: integration.accessToken,
        refresh_token: integration.refreshToken,
        expiry_date: integration.expiryDate.getTime(),
      });

      oauth2Client.on("tokens", async (tokens) => {
        // if (tokens.access_token) {
        //   await prisma.googleIntegration.update({
        //     where: {
        //       organizationId: booking.organizationId,
        //     },
        //     data: {
        //       accessToken: tokens.access_token,
        //       expiryDate: new Date(tokens.expiry_date!),
        //     },
        //   });
        // }

        await prisma.googleIntegration.update({
          where: {
            organizationId: booking.organizationId,
          },
          data: {
            accessToken: tokens.access_token ?? integration.accessToken,
            expiryDate: tokens.expiry_date
              ? new Date(tokens.expiry_date)
              : integration.expiryDate,
            ...(tokens.refresh_token && {
              refreshToken: tokens.refresh_token,
            }),
          },
        });
      });

      const calendar = google.calendar({
        version: "v3",
        auth: oauth2Client,
      });

      const event = await calendar.events.insert({
        calendarId: "primary",
        requestBody: {
          summary: booking.service.title,
          description: "Meeting scheduled via app",
          start: {
            dateTime: booking.startTime.toISOString(),
            timeZone: booking.organization.timezone,
          },
          end: {
            dateTime: booking.endTime.toISOString(),
            timeZone: booking.organization.timezone,
          },
          conferenceData: {
            createRequest: {
              requestId: bookingId,
            },
          },
        },
        conferenceDataVersion: 1,
      });

      // console.log(event);

      const meetLink = event.data.conferenceData?.entryPoints?.[0]?.uri || null;
      console.log({ meetLink });

      await prisma.booking.update({
        where: {
          id: booking.id,
        },
        data: {
          meetingLink: meetLink,
          status: "CONFIRMED",
        },
      });

      await queueBookingConfirmationEmail(booking.id);
    } catch (error: any) {
      console.error("Job failed: ", job.id);
      console.error("Reason for job failure: ", error?.message);

      await deadLetterQueue.add("failed-meetingLinkCreation", {
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
  }
);
