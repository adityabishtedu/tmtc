const mongoose = require("mongoose");

const connectDB = async () => {
  // Skip MongoDB in demo mode
  if (process.env.SKIP_MONGODB === "true") {
    console.log("⚠️  MongoDB skipped - running in demo mode");
    return;
  }

  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/travel_itinerary_db";

    if (!mongoUri || mongoUri === "undefined" || mongoUri === "") {
      throw new Error("MONGODB_URI environment variable is not set");
    }

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message);
    console.error(
      "Please ensure MongoDB is running and MONGODB_URI is set correctly"
    );
    console.error("You can copy sample.env to .env and update the MongoDB URI");
    console.error("Or use 'node start-dev-no-db.js' for demo mode");
    process.exit(1);
  }
};

module.exports = connectDB;
