import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

redis.on("connect", () => {
  console.log("Connected to Cloud Redis!");
});

redis.on("error", (err) => {
  console.error("Redis Connection Error:", err);
});

export default redis;
