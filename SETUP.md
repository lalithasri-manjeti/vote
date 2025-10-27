# PollVote Full-Stack Application Setup Guide

This guide will help you set up and run the complete PollVote application with both frontend and backend.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
- **Git** - [Download here](https://git-scm.com/)

## Quick Start

### 1. Start MongoDB

**Windows:**
```bash
# Start MongoDB service
net start MongoDB
```

**macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**Ubuntu/Linux:**
```bash
sudo systemctl start mongod
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Edit .env file with your configuration
# Default values should work for local development

# Start the backend server
npm run dev
```

The backend will start on `http://localhost:3001`

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Create environment file
cp env.example .env

# Start the frontend development server
npm run dev
```

The frontend will start on `http://localhost:8080`

## Detailed Setup Instructions

### Backend Configuration

1. **Environment Variables** (`backend/.env`):
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/pollvote
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
```

2. **Database Setup**:
   - MongoDB should be running on `localhost:27017`
   - The application will automatically create the `pollvote` database
   - Collections (`users`, `polls`) will be created automatically

### Frontend Configuration

1. **Environment Variables** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:3001/api
```

2. **API Integration**:
   - The frontend automatically connects to the backend API
   - Authentication tokens are stored in localStorage
   - All API calls go through the `apiService`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Polls
- `GET /api/polls` - Get all polls (with filtering)
- `GET /api/polls/:id` - Get single poll
- `POST /api/polls` - Create new poll
- `POST /api/polls/:id/vote` - Vote on poll
- `PUT /api/polls/:id` - Update poll
- `DELETE /api/polls/:id` - Delete poll

## Features

### Backend Features
- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ CORS configuration
- ✅ Security headers with Helmet
- ✅ Error handling middleware
- ✅ MongoDB with Mongoose ODM
- ✅ RESTful API design

### Frontend Features
- ✅ React with TypeScript
- ✅ Modern UI with shadcn/ui components
- ✅ Responsive design
- ✅ Real-time poll updates
- ✅ Chart visualization for results
- ✅ Form validation with Zod
- ✅ Toast notifications
- ✅ Loading states and error handling

## Development

### Backend Development
```bash
cd backend
npm run dev  # Starts with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Starts Vite dev server
```

### Testing
```bash
# Backend tests
cd backend
npm test

# Frontend tests (if configured)
cd frontend
npm test
```

## Production Deployment

### Backend Deployment
1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure production MongoDB URI
4. Set up proper CORS origins
5. Use PM2 or similar process manager

### Frontend Deployment
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting service
3. Update `VITE_API_URL` to point to your production backend

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**:
   - Ensure MongoDB is running
   - Check the connection string in `.env`
   - Verify MongoDB is accessible on the specified port

2. **CORS Errors**:
   - Check CORS configuration in `backend/src/server.js`
   - Ensure frontend URL is included in CORS origins

3. **Authentication Issues**:
   - Check JWT_SECRET is set
   - Verify token is being sent in Authorization header
   - Check token expiration

4. **Port Conflicts**:
   - Backend runs on port 3001 by default
   - Frontend runs on port 8080 by default
   - Change ports in respective `.env` files if needed

### Logs and Debugging

- Backend logs are displayed in the terminal
- Frontend errors appear in browser console
- Use browser dev tools Network tab to debug API calls

## Project Structure

```
pollvote/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── pollController.js
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   └── validationMiddleware.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Poll.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── pollRoutes.js
│   │   └── server.js
│   ├── package.json
│   ├── env.example
│   └── README.md
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── contexts/
    │   ├── hooks/
    │   ├── pages/
    │   ├── services/
    │   └── ...
    ├── package.json
    └── env.example
```

## Support

If you encounter any issues:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check that all dependencies are installed
5. Review the API documentation in `backend/README.md`

## License

MIT License - see LICENSE file for details.
