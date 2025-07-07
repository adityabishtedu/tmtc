// Test setup file
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-secret-key";
process.env.MONGODB_URI = "mongodb://localhost:27017/travel_itinerary_test";
process.env.REDIS_URL = "redis://localhost:6379";
process.env.PORT = 3001;
