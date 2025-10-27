const { body } = require('express-validator');

// User validation rules
const validateRegister = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage('Username must be between 3 and 50 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Poll validation rules
const validateCreatePoll = [
  body('question')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Question must be between 5 and 200 characters'),
  
  body('options')
    .isArray({ min: 2, max: 5 })
    .withMessage('Poll must have between 2 and 5 options'),
  
  body('options.*.text')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Each option must be between 1 and 100 characters'),
  
  body('expiresAt')
    .optional()
    .isISO8601()
    .withMessage('Expiration date must be a valid date')
    .custom((value) => {
      if (value && new Date(value) <= new Date()) {
        throw new Error('Expiration date must be in the future');
      }
      return true;
    })
];

const validateVote = [
  body('optionIndex')
    .isInt({ min: 0 })
    .withMessage('Option index must be a non-negative integer')
];

module.exports = {
  validateRegister,
  validateLogin,
  validateCreatePoll,
  validateVote
};
