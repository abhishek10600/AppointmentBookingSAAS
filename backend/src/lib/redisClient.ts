import Redis from "ioredis";
import { redisConnection } from "./redis.js";

const RedisClient = Redis as unknown as typeof import("ioredis").default;

export const redis = new RedisClient(redisConnection);

redis.on("connect", () => {
  console.log("Redis connected successfully");
});

redis.on("error", (error: any) => {
  console.log("Redis failed to connect. Error: ", error);
});
