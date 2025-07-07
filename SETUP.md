# Quick Setup Guide

## 🚀 Ready to Run!

The application is fully implemented and ready to use. Follow these simple steps:

## Method 1: Quick Start (No Database Setup Required)

```bash
# Install dependencies
npm install

# Run with fallback environment variables
npm run dev
```

✅ **That's it!** The API will start with development defaults.

⚠️ **Note**: Without MongoDB, some features won't work, but the server will start successfully.

## Method 2: Full Setup (Recommended)

### Prerequisites

- MongoDB running on `localhost:27017`
- Redis running on `localhost:6379` (optional)

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp sample.env .env
# Edit .env with your MongoDB URI if different

# 3. Run the application
npm run dev
```

## Method 3: Docker (Complete Setup)

```bash
# Start everything with Docker
docker-compose up -d
```

This will start:

- MongoDB database
- Redis cache
- Travel Itinerary API

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

## 📖 API Documentation

Once running, visit:

- **API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **API Docs**: http://localhost:3000/api-docs

## 🔧 Environment Variables

The application includes smart defaults:

| Variable    | Default Value                                 |
| ----------- | --------------------------------------------- |
| PORT        | 3000                                          |
| MONGODB_URI | mongodb://localhost:27017/travel_itinerary_db |
| JWT_SECRET  | dev-secret-key-change-in-production           |
| NODE_ENV    | development                                   |

## ✅ What's Included

- ✅ JWT Authentication
- ✅ Itinerary CRUD Operations
- ✅ Pagination, Sorting, Filtering
- ✅ Redis Caching
- ✅ Rate Limiting
- ✅ Sharing Feature
- ✅ Comprehensive Tests
- ✅ Docker Support
- ✅ API Documentation

## 🎯 Quick Test

```bash
# Check if API is running
curl http://localhost:3000/health

# Should return:
# {"success":true,"message":"Travel Itinerary API is running","timestamp":"..."}
```

## 📱 API Endpoints

**Authentication:**

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

**Itineraries:**

- `POST /api/itineraries` - Create itinerary
- `GET /api/itineraries` - Get all itineraries
- `GET /api/itineraries/:id` - Get specific itinerary
- `PUT /api/itineraries/:id` - Update itinerary
- `DELETE /api/itineraries/:id` - Delete itinerary
- `GET /api/itineraries/share/:shareableId` - Public shared itinerary

Ready to start building amazing travel itineraries! 🌍✈️
