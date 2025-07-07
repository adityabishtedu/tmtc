# Travel Itinerary Management API

A robust RESTful API for managing travel itineraries with authentication, caching, and sharing features.

## 🚀 Features

- **User Authentication**: JWT-based authentication with password hashing
- **Itinerary Management**: Full CRUD operations for travel itineraries
- **Advanced Querying**: Pagination, sorting, and filtering capabilities
- **Performance Optimization**: Redis caching and database indexing
- **Sharing Feature**: Public shareable links for itineraries
- **Security**: Rate limiting, input validation, and security headers
- **Testing**: Comprehensive unit and integration tests
- **Documentation**: Swagger API documentation
- **Containerization**: Docker and Docker Compose support

## 🛠 Tech Stack

- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with bcrypt password hashing
- **Caching**: Redis
- **Validation**: Express-validator
- **Testing**: Jest with Supertest
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet, CORS, Rate limiting
- **Containerization**: Docker & Docker Compose

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Redis (optional - falls back to in-memory cache)
- Docker & Docker Compose (for containerized deployment)

## 🚀 Quick Start

### Option 1: Local Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd travel-itinerary-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   # Option 1: Copy sample environment file
   cp sample.env .env
   # Edit .env with your configuration

   # Option 2: Use development script (has fallback values)
   # No .env file needed - uses defaults
   ```

4. **Start MongoDB and Redis (Optional)**

   ```bash
   # MongoDB is required for full functionality
   # Redis is optional - will use in-memory cache if not available
   ```

5. **Run the application**

   ```bash
   # With environment fallbacks (recommended for development)
   npm run dev

   # Or use your own .env file
   npm run dev:basic
   ```

### Option 2: Docker Deployment

1. **Clone and navigate to the project**

   ```bash
   git clone <repository-url>
   cd travel-itinerary-api
   ```

2. **Start all services with Docker Compose**

   ```bash
   docker-compose up -d
   ```

3. **Access the API**
   - API: http://localhost:3000
   - API Documentation: http://localhost:3000/api-docs
   - Health Check: http://localhost:3000/health

## 📚 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get User Profile

```http
GET /api/auth/profile
Authorization: Bearer <jwt-token>
```

### Itinerary Endpoints

#### Create Itinerary

```http
POST /api/itineraries
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Paris Adventure",
  "destination": "Paris, France",
  "startDate": "2024-06-01",
  "endDate": "2024-06-05",
  "activities": [
    {
      "time": "09:00",
      "description": "Visit Eiffel Tower",
      "location": "Eiffel Tower"
    }
  ]
}
```

#### Get All Itineraries

```http
GET /api/itineraries?page=1&limit=10&sort=createdAt&destination=Paris
Authorization: Bearer <jwt-token>
```

#### Get Specific Itinerary

```http
GET /api/itineraries/:id
Authorization: Bearer <jwt-token>
```

#### Update Itinerary

```http
PUT /api/itineraries/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Updated Paris Adventure"
}
```

#### Delete Itinerary

```http
DELETE /api/itineraries/:id
Authorization: Bearer <jwt-token>
```

#### Get Shared Itinerary (Public)

```http
GET /api/itineraries/share/:shareableId
```

## 🔧 Configuration

### Environment Variables

| Variable                  | Description               | Default                                       |
| ------------------------- | ------------------------- | --------------------------------------------- |
| `PORT`                    | Server port               | 3000                                          |
| `NODE_ENV`                | Environment               | development                                   |
| `MONGODB_URI`             | MongoDB connection string | mongodb://localhost:27017/travel_itinerary_db |
| `JWT_SECRET`              | JWT secret key            | -                                             |
| `JWT_EXPIRES_IN`          | JWT expiration time       | 7d                                            |
| `REDIS_URL`               | Redis connection string   | redis://localhost:6379                        |
| `REDIS_TTL`               | Cache TTL in seconds      | 300                                           |
| `RATE_LIMIT_WINDOW_MS`    | Rate limit window         | 900000                                        |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window   | 100                                           |

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

The test suite includes:

- Authentication endpoints (register, login, profile)
- Itinerary CRUD operations
- Validation and error handling
- Authentication middleware
- Pagination, sorting, and filtering

## 📊 API Features

### Pagination

```http
GET /api/itineraries?page=1&limit=10
```

### Sorting

```http
GET /api/itineraries?sort=startDate&order=desc
```

### Filtering

```http
GET /api/itineraries?destination=Paris
```

### Caching

- GET requests for individual itineraries are cached for 5 minutes
- Cache is automatically cleared on updates/deletes

### Rate Limiting

- 100 requests per 15 minutes per IP address
- Configurable via environment variables

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Protection against abuse
- **Security Headers**: Helmet.js for security headers
- **CORS**: Configurable cross-origin resource sharing

## 🐳 Docker Commands

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f api

# Stop all services
docker-compose down

# Rebuild and start
docker-compose up --build -d

# Remove volumes (data)
docker-compose down -v
```

## 📁 Project Structure

```
├── src/
│   ├── config/          # Database and Redis configuration
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── server.js        # Main application file
├── tests/               # Test files
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose configuration
├── jest.config.js       # Jest configuration
├── package.json         # Dependencies and scripts
└── README.md           # Project documentation
```

## 🚀 Deployment

### Production Deployment

1. **Set production environment variables**
2. **Use PM2 or similar process manager**
3. **Set up reverse proxy (Nginx)**
4. **Configure SSL certificates**
5. **Set up monitoring and logging**

### Environment Variables for Production

```bash
NODE_ENV=production
JWT_SECRET=your-super-secure-production-secret
MONGODB_URI=mongodb://your-production-mongodb-uri
REDIS_URL=redis://your-production-redis-uri
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the API documentation at `/api-docs`
- Review the test files for usage examples

## 🔄 API Versioning

The API follows semantic versioning. Current version: v1.0.0

## 📈 Performance

- Database queries are optimized with proper indexing
- Redis caching reduces database load
- Rate limiting prevents abuse
- Efficient pagination for large datasets

## 🔍 Monitoring

- Health check endpoint: `GET /health`
- Docker health checks configured
- Comprehensive error logging
- Request/response logging in development
