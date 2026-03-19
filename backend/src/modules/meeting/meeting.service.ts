import { meetingQueue } from "../../queues/meeting.queue.js";

export const queueCreateMeeting = async (bookingId: string) => {
  await meetingQueue.add(
    "create-meeting",
    { bookingId },
    {
      jobId: `meeting-${bookingId}`,
    }
  );
};
