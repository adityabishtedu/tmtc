const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../src/server");
const User = require("../src/models/User");
const Itinerary = require("../src/models/Itinerary");

describe("Itinerary Endpoints", () => {
  let token;
  let user;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Itinerary.deleteMany({});

    // Create a test user and get token
    const userData = {
      email: "test@example.com",
      password: "password123",
      name: "Test User",
    };

    const registerResponse = await request(app)
      .post("/api/auth/register")
      .send(userData);

    token = registerResponse.body.data.token;
    user = registerResponse.body.data.user;
  });

  describe("POST /api/itineraries", () => {
    it("should create a new itinerary successfully", async () => {
      const itineraryData = {
        title: "Paris Trip",
        destination: "Paris, France",
        startDate: "2024-06-01",
        endDate: "2024-06-05",
        activities: [
          {
            time: "09:00",
            description: "Visit Eiffel Tower",
            location: "Eiffel Tower",
          },
        ],
      };

      const response = await request(app)
        .post("/api/itineraries")
        .set("Authorization", `Bearer ${token}`)
        .send(itineraryData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Itinerary created successfully");
      expect(response.body.data.itinerary.title).toBe(itineraryData.title);
      expect(response.body.data.itinerary.destination).toBe(
        itineraryData.destination
      );
      expect(response.body.data.itinerary.userId).toBe(user._id);
      expect(response.body.data.itinerary.activities).toHaveLength(1);
      expect(response.body.data).toHaveProperty("shareableLink");
    });

    it("should return validation error for missing required fields", async () => {
      const itineraryData = {
        title: "Paris Trip",
        // Missing destination, startDate, endDate
      };

      const response = await request(app)
        .post("/api/itineraries")
        .set("Authorization", `Bearer ${token}`)
        .send(itineraryData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation failed");
    });

    it("should return error for end date before start date", async () => {
      const itineraryData = {
        title: "Paris Trip",
        destination: "Paris, France",
        startDate: "2024-06-05",
        endDate: "2024-06-01", // End date before start date
      };

      const response = await request(app)
        .post("/api/itineraries")
        .set("Authorization", `Bearer ${token}`)
        .send(itineraryData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("End date must be after start date");
    });

    it("should return error without authentication", async () => {
      const itineraryData = {
        title: "Paris Trip",
        destination: "Paris, France",
        startDate: "2024-06-01",
        endDate: "2024-06-05",
      };

      const response = await request(app)
        .post("/api/itineraries")
        .send(itineraryData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /api/itineraries", () => {
    beforeEach(async () => {
      // Create test itineraries
      const itineraries = [
        {
          userId: user._id,
          title: "Paris Trip",
          destination: "Paris, France",
          startDate: "2024-06-01",
          endDate: "2024-06-05",
          activities: [],
        },
        {
          userId: user._id,
          title: "Tokyo Adventure",
          destination: "Tokyo, Japan",
          startDate: "2024-07-01",
          endDate: "2024-07-10",
          activities: [],
        },
      ];

      await Itinerary.insertMany(itineraries);
    });

    it("should get all itineraries for authenticated user", async () => {
      const response = await request(app)
        .get("/api/itineraries")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.itineraries).toHaveLength(2);
      expect(response.body.data.pagination).toBeDefined();
    });

    it("should support pagination", async () => {
      const response = await request(app)
        .get("/api/itineraries?page=1&limit=1")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.data.itineraries).toHaveLength(1);
      expect(response.body.data.pagination.currentPage).toBe(1);
      expect(response.body.data.pagination.itemsPerPage).toBe(1);
    });

    it("should support filtering by destination", async () => {
      const response = await request(app)
        .get("/api/itineraries?destination=Paris")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.data.itineraries).toHaveLength(1);
      expect(response.body.data.itineraries[0].destination).toBe(
        "Paris, France"
      );
    });

    it("should support sorting", async () => {
      const response = await request(app)
        .get("/api/itineraries?sort=title&order=asc")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.data.itineraries[0].title).toBe("Paris Trip");
      expect(response.body.data.itineraries[1].title).toBe("Tokyo Adventure");
    });
  });

  describe("GET /api/itineraries/:id", () => {
    let itinerary;

    beforeEach(async () => {
      itinerary = new Itinerary({
        userId: user._id,
        title: "Paris Trip",
        destination: "Paris, France",
        startDate: "2024-06-01",
        endDate: "2024-06-05",
        activities: [],
      });
      await itinerary.save();
    });

    it("should get a specific itinerary", async () => {
      const response = await request(app)
        .get(`/api/itineraries/${itinerary._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.itinerary._id).toBe(itinerary._id.toString());
      expect(response.body.data.itinerary.title).toBe("Paris Trip");
    });

    it("should return 404 for non-existent itinerary", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/itineraries/${fakeId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Itinerary not found");
    });

    it("should not allow access to other user's itinerary", async () => {
      // Create another user and itinerary
      const otherUser = new User({
        email: "other@example.com",
        password: "password123",
        name: "Other User",
      });
      await otherUser.save();

      const otherItinerary = new Itinerary({
        userId: otherUser._id,
        title: "Other Trip",
        destination: "Other Place",
        startDate: "2024-06-01",
        endDate: "2024-06-05",
        activities: [],
      });
      await otherItinerary.save();

      const response = await request(app)
        .get(`/api/itineraries/${otherItinerary._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Itinerary not found");
    });
  });

  describe("PUT /api/itineraries/:id", () => {
    let itinerary;

    beforeEach(async () => {
      itinerary = new Itinerary({
        userId: user._id,
        title: "Paris Trip",
        destination: "Paris, France",
        startDate: "2024-06-01",
        endDate: "2024-06-05",
        activities: [],
      });
      await itinerary.save();
    });

    it("should update an itinerary successfully", async () => {
      const updateData = {
        title: "Updated Paris Trip",
        destination: "Paris, France",
      };

      const response = await request(app)
        .put(`/api/itineraries/${itinerary._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Itinerary updated successfully");
      expect(response.body.data.itinerary.title).toBe("Updated Paris Trip");
    });

    it("should return 404 for non-existent itinerary", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/itineraries/${fakeId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Updated" })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Itinerary not found");
    });
  });

  describe("DELETE /api/itineraries/:id", () => {
    let itinerary;

    beforeEach(async () => {
      itinerary = new Itinerary({
        userId: user._id,
        title: "Paris Trip",
        destination: "Paris, France",
        startDate: "2024-06-01",
        endDate: "2024-06-05",
        activities: [],
      });
      await itinerary.save();
    });

    it("should delete an itinerary successfully", async () => {
      const response = await request(app)
        .delete(`/api/itineraries/${itinerary._id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Itinerary deleted successfully");

      // Verify it's actually deleted
      const deletedItinerary = await Itinerary.findById(itinerary._id);
      expect(deletedItinerary).toBeNull();
    });

    it("should return 404 for non-existent itinerary", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/itineraries/${fakeId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Itinerary not found");
    });
  });
});
