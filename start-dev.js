// Development startup script with environment variable fallbacks
process.env.NODE_ENV = process.env.NODE_ENV || "development";
process.env.PORT = process.env.PORT || "3000";
process.env.MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/travel_itinerary_db";
process.env.JWT_SECRET =
  process.env.JWT_SECRET || "dev-secret-key-change-in-production";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
process.env.REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
process.env.REDIS_TTL = process.env.REDIS_TTL || "300";
process.env.RATE_LIMIT_WINDOW_MS = process.env.RATE_LIMIT_WINDOW_MS || "900000";
process.env.RATE_LIMIT_MAX_REQUESTS =
  process.env.RATE_LIMIT_MAX_REQUESTS || "100";
process.env.BASE_URL = process.env.BASE_URL || "http://localhost:3000";
process.env.SKIP_REDIS = process.env.SKIP_REDIS || "true"; // Skip Redis in dev mode

console.log("🚀 Starting Travel Itinerary API in development mode...");
console.log("📊 Environment variables loaded");
console.log(`🌐 MongoDB URI: ${process.env.MONGODB_URI}`);
console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET.substring(0, 10)}...`);
console.log(`📱 Port: ${process.env.PORT}`);
console.log("");

// Load the main application
require("./src/server.js");
