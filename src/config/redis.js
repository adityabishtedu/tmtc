const redis = require("redis");

let redisClient = null;

const connectRedis = async () => {
  // Skip Redis in development if environment variable is set
  if (process.env.SKIP_REDIS === "true") {
    console.log("⚠️  Redis skipped - using in-memory cache");
    return null;
  }

  try {
    redisClient = redis.createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
      socket: {
        connectTimeout: 2000,
        lazyConnect: true,
      },
    });

    // Suppress error logging after first warning
    let errorLogged = false;
    redisClient.on("error", (err) => {
      if (!errorLogged) {
        console.warn(
          "⚠️  Redis not available - using in-memory cache fallback"
        );
        errorLogged = true;
      }
      redisClient = null;
    });

    redisClient.on("connect", () => {
      console.log("✅ Redis Connected");
    });

    // Try to connect with timeout
    await Promise.race([
      redisClient.connect(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Connection timeout")), 2000)
      ),
    ]);

    return redisClient;
  } catch (error) {
    console.warn("⚠️  Redis not available - using in-memory cache fallback");
    redisClient = null;
    return null;
  }
};

const getRedisClient = () => {
  return redisClient;
};

const closeRedis = async () => {
  if (redisClient) {
    try {
      await redisClient.quit();
    } catch (error) {
      // Ignore errors during shutdown
    }
  }
};

module.exports = {
  connectRedis,
  getRedisClient,
  closeRedis,
};
