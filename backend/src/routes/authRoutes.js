const express = require('express');
const { register, login, getMe } = require('../controllers/authController');
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware');
const { validateRequest } = require('../middleware/errorMiddleware');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register',  register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login',  login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', authenticate, getMe);

module.exports = router;
