import { Queue } from "bullmq";
import { redisConnection } from "../lib/redis.js";

export const meetingQueue = new Queue("meetingQueue", {
  connection: redisConnection,
});
