const express = require("express");
const itineraryController = require("../controllers/itineraryController");
const { cache } = require("../middleware/cache");

const router = express.Router();

// Public route to get shared itinerary (no authentication required)
router.get("/:shareableId", cache(300), itineraryController.getSharedItinerary);

module.exports = router;
