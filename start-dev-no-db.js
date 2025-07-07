// Development startup script - works without MongoDB or Redis
process.env.NODE_ENV = "development";
process.env.PORT = "3000";
process.env.MONGODB_URI = ""; // Empty to test without MongoDB
process.env.JWT_SECRET = "dev-secret-key-change-in-production";
process.env.JWT_EXPIRES_IN = "7d";
process.env.REDIS_URL = "";
process.env.REDIS_TTL = "300";
process.env.RATE_LIMIT_WINDOW_MS = "900000";
process.env.RATE_LIMIT_MAX_REQUESTS = "100";
process.env.BASE_URL = "http://localhost:3000";
process.env.SKIP_REDIS = "true";
process.env.SKIP_MONGODB = "true";

console.log("🚀 Starting Travel Itinerary API in demo mode...");
console.log("📊 Environment variables loaded");
console.log("⚠️  Running without databases (MongoDB & Redis)");
console.log(
  "✅ Server will start but database operations will fail gracefully"
);
console.log(`📱 Port: ${process.env.PORT}`);
console.log("");

// Load the main application
require("./src/server.js");
