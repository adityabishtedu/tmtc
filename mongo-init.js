// MongoDB initialization script for Docker
db = db.getSiblingDB("travel_itinerary_db");

// Create collections with proper indexes
db.createCollection("users");
db.createCollection("itineraries");

// Create indexes for better performance
db.users.createIndex({ email: 1 }, { unique: true });
db.itineraries.createIndex({ userId: 1 });
db.itineraries.createIndex({ destination: 1 });
db.itineraries.createIndex({ startDate: 1 });
db.itineraries.createIndex({ createdAt: 1 });
db.itineraries.createIndex({ shareableId: 1 }, { unique: true });

print("MongoDB initialized successfully");
