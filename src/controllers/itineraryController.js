const Itinerary = require("../models/Itinerary");

// Create a new itinerary
const createItinerary = async (req, res) => {
  try {
    const { title, destination, startDate, endDate, activities } = req.body;

    const itinerary = new Itinerary({
      userId: req.user._id,
      title,
      destination,
      startDate,
      endDate,
      activities: activities || [],
    });

    await itinerary.save();

    res.status(201).json({
      success: true,
      message: "Itinerary created successfully",
      data: {
        itinerary,
        shareableLink: itinerary.getShareableLink(),
      },
    });
  } catch (error) {
    console.error("Create itinerary error:", error);
    if (error.message === "End date must be after start date") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get all itineraries with pagination, sorting, and filtering
const getItineraries = async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = "createdAt", destination } = req.query;

    // Build query
    const query = { userId: req.user._id };
    if (destination) {
      query.destination = { $regex: destination, $options: "i" };
    }

    // Build sort object
    const sortOptions = {};
    const sortOrder = req.query.order === "desc" ? -1 : 1;
    sortOptions[sort] = sortOrder;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const itineraries = await Itinerary.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate("userId", "name email");

    // Get total count for pagination
    const total = await Itinerary.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.json({
      success: true,
      data: {
        itineraries,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalItems: total,
          itemsPerPage: parseInt(limit),
        },
      },
    });
  } catch (error) {
    console.error("Get itineraries error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get a specific itinerary
const getItinerary = async (req, res) => {
  try {
    const { id } = req.params;

    const itinerary = await Itinerary.findOne({
      _id: id,
      userId: req.user._id,
    }).populate("userId", "name email");

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: "Itinerary not found",
      });
    }

    res.json({
      success: true,
      data: {
        itinerary,
        shareableLink: itinerary.getShareableLink(),
      },
    });
  } catch (error) {
    console.error("Get itinerary error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update an itinerary
const updateItinerary = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const itinerary = await Itinerary.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    ).populate("userId", "name email");

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: "Itinerary not found",
      });
    }

    res.json({
      success: true,
      message: "Itinerary updated successfully",
      data: {
        itinerary,
        shareableLink: itinerary.getShareableLink(),
      },
    });
  } catch (error) {
    console.error("Update itinerary error:", error);
    if (error.message === "End date must be after start date") {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Delete an itinerary
const deleteItinerary = async (req, res) => {
  try {
    const { id } = req.params;

    const itinerary = await Itinerary.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: "Itinerary not found",
      });
    }

    res.json({
      success: true,
      message: "Itinerary deleted successfully",
    });
  } catch (error) {
    console.error("Delete itinerary error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get shared itinerary (public access)
const getSharedItinerary = async (req, res) => {
  try {
    const { shareableId } = req.params;

    const itinerary = await Itinerary.findOne({ shareableId });

    if (!itinerary) {
      return res.status(404).json({
        success: false,
        message: "Shared itinerary not found",
      });
    }

    res.json({
      success: true,
      data: {
        itinerary: itinerary.toPublicJSON(),
      },
    });
  } catch (error) {
    console.error("Get shared itinerary error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  createItinerary,
  getItineraries,
  getItinerary,
  updateItinerary,
  deleteItinerary,
  getSharedItinerary,
};
