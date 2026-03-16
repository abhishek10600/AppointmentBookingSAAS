import { Queue } from "bullmq";
import { redisConnection } from "../lib/redis.js";

export const emailQueue = new Queue("emailQueue", {
  connection: redisConnection,
});
