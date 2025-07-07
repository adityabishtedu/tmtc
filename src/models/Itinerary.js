const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const activitySchema = new mongoose.Schema({
  time: {
    type: String,
    required: [true, "Activity time is required"],
  },
  description: {
    type: String,
    required: [true, "Activity description is required"],
    trim: true,
  },
  location: {
    type: String,
    required: [true, "Activity location is required"],
    trim: true,
  },
});

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    title: {
      type: String,
      required: [true, "Itinerary title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    destination: {
      type: String,
      required: [true, "Destination is required"],
      trim: true,
      maxlength: [100, "Destination cannot exceed 100 characters"],
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    activities: [activitySchema],
    shareableId: {
      type: String,
      unique: true,
      default: () => uuidv4(),
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
itinerarySchema.index({ userId: 1 });
itinerarySchema.index({ destination: 1 });
itinerarySchema.index({ startDate: 1 });
itinerarySchema.index({ createdAt: 1 });
itinerarySchema.index({ shareableId: 1 });

// Validate that end date is after start date
itinerarySchema.pre("save", function (next) {
  if (this.endDate <= this.startDate) {
    return next(new Error("End date must be after start date"));
  }
  next();
});

// Generate shareable link
itinerarySchema.methods.getShareableLink = function () {
  return `${
    process.env.BASE_URL || "http://localhost:3000"
  }/api/itineraries/share/${this.shareableId}`;
};

// Remove sensitive data for public sharing
itinerarySchema.methods.toPublicJSON = function () {
  const itineraryObject = this.toObject();
  delete itineraryObject.userId;
  delete itineraryObject._id;
  delete itineraryObject.__v;
  return itineraryObject;
};

module.exports = mongoose.model("Itinerary", itinerarySchema);
