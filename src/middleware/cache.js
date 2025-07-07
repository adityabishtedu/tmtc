const { getRedisClient } = require("../config/redis");

const cache = (duration = 300) => {
  return async (req, res, next) => {
    const redisClient = getRedisClient();

    if (!redisClient) {
      return next();
    }

    const key = `cache:${req.originalUrl}`;

    try {
      const cachedData = await redisClient.get(key);

      if (cachedData) {
        return res.json(JSON.parse(cachedData));
      }

      // Store original send method
      const originalSend = res.json;

      // Override send method to cache the response
      res.json = function (data) {
        // Cache the response
        redisClient.setEx(key, duration, JSON.stringify(data));

        // Call original send method
        return originalSend.call(this, data);
      };

      next();
    } catch (error) {
      console.error("Cache middleware error:", error);
      next();
    }
  };
};

const clearCache = (pattern = "*") => {
  return async (req, res, next) => {
    const redisClient = getRedisClient();

    if (redisClient) {
      try {
        const keys = await redisClient.keys(`cache:${pattern}`);
        if (keys.length > 0) {
          await redisClient.del(keys);
        }
      } catch (error) {
        console.error("Clear cache error:", error);
      }
    }

    next();
  };
};

module.exports = {
  cache,
  clearCache,
};
