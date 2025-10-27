# PollVote Backend API

A RESTful API backend for the PollVote application built with Node.js, Express, and MongoDB.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Poll Management**: Create, read, update, and delete polls
- **Voting System**: Secure voting with duplicate prevention
- **Data Validation**: Comprehensive input validation and sanitization
- **Security**: Rate limiting, CORS, helmet security headers
- **Error Handling**: Centralized error handling with detailed error messages

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: bcryptjs, helmet, express-rate-limit
- **Validation**: express-validator

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `env.example`:
```bash
cp env.example .env
```

3. Update the `.env` file with your configuration:
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/pollvote
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
```

4. Start MongoDB (make sure MongoDB is running on your system)

5. Run the application:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/register` | Register a new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user | Private |

### Poll Routes (`/api/polls`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/` | Get all polls | Public |
| GET | `/:id` | Get single poll | Public |
| POST | `/` | Create new poll | Private |
| POST | `/:id/vote` | Vote on poll | Private |
| PUT | `/:id` | Update poll | Private |
| DELETE | `/:id` | Delete poll | Private |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API health status |

## Request/Response Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "Password123"
}
```

### Create Poll
```bash
POST /api/polls
Authorization: Bearer <token>
Content-Type: application/json

{
  "question": "What's your favorite programming language?",
  "options": ["JavaScript", "Python", "Java", "C++"],
  "expiresAt": "2024-12-31T23:59:59.000Z"
}
```

### Vote on Poll
```bash
POST /api/polls/:id/vote
Authorization: Bearer <token>
Content-Type: application/json

{
  "optionIndex": 0
}
```

## Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "value": "invalid-email"
    }
  ]
}
```

## Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Input Validation**: Comprehensive validation and sanitization
- **Error Sanitization**: No sensitive data in error responses

## Database Schema

### User Model
```javascript
{
  username: String (required, unique, 3-50 chars),
  email: String (required, unique, valid email),
  password: String (required, min 6 chars, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

### Poll Model
```javascript
{
  question: String (required, 5-200 chars),
  options: [{
    text: String (required, 1-100 chars),
    votes: Number (default: 0, min: 0)
  }] (2-5 options),
  createdBy: ObjectId (ref: User),
  expiresAt: Date (optional, future date),
  votedUsers: [ObjectId] (ref: User),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## Development

### Project Structure
```
src/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── pollController.js    # Poll management logic
├── middleware/
│   ├── authMiddleware.js    # JWT authentication
│   ├── errorMiddleware.js   # Error handling
│   └── validationMiddleware.js # Input validation
├── models/
│   ├── User.js              # User schema
│   └── Poll.js              # Poll schema
├── routes/
│   ├── authRoutes.js         # Authentication routes
│   └── pollRoutes.js         # Poll routes
└── server.js                 # Main server file
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment mode | development |
| PORT | Server port | 3001 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/pollvote |
| JWT_SECRET | JWT signing secret | - |
| JWT_EXPIRE | JWT expiration time | 7d |

## Testing

Run tests with:
```bash
npm test
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure proper CORS origins
4. Use a production MongoDB instance
5. Set up proper logging and monitoring
6. Use a process manager like PM2

## License

MIT
