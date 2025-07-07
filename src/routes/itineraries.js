const express = require("express");
const { body } = require("express-validator");
const itineraryController = require("../controllers/itineraryController");
const auth = require("../middleware/auth");
const validate = require("../middleware/validation");
const { cache, clearCache } = require("../middleware/cache");

const router = express.Router();

// Validation rules
const itineraryValidation = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title is required and cannot exceed 100 characters"),
  body("destination")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Destination is required and cannot exceed 100 characters"),
  body("startDate").isISO8601().withMessage("Start date must be a valid date"),
  body("endDate").isISO8601().withMessage("End date must be a valid date"),
  body("activities")
    .optional()
    .isArray()
    .withMessage("Activities must be an array"),
  body("activities.*.time")
    .optional()
    .notEmpty()
    .withMessage("Activity time is required"),
  body("activities.*.description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Activity description is required"),
  body("activities.*.location")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Activity location is required"),
];

// Protected routes (require authentication)
router.use(auth);

// Create itinerary
router.post(
  "/",
  itineraryValidation,
  validate,
  clearCache("*"),
  itineraryController.createItinerary
);

// Get all itineraries (with caching)
router.get("/", cache(300), itineraryController.getItineraries);

// Get specific itinerary (with caching)
router.get("/:id", cache(300), itineraryController.getItinerary);

// Update itinerary
router.put(
  "/:id",
  itineraryValidation,
  validate,
  clearCache("*"),
  itineraryController.updateItinerary
);

// Delete itinerary
router.delete("/:id", clearCache("*"), itineraryController.deleteItinerary);

module.exports = router;
