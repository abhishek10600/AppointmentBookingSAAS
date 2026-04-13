import { redis } from "../lib/redisClient.js";

export const cache = {
  async get(key: string) {
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  async set(key: string, value: any, ttlSeconds?: number) {
    if (ttlSeconds) {
      await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
    } else {
      await redis.set(key, JSON.stringify(value));
    }
  },

  async del(key: string) {
    await redis.del(key);
  },
};
