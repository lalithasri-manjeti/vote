const express = require('express');
const {
  getAllPolls,
  getPoll,
  createPoll,
  voteOnPoll,
  updatePoll,
  deletePoll
} = require('../controllers/pollController');
const { validateCreatePoll, validateVote } = require('../middleware/validationMiddleware');
const { validateRequest } = require('../middleware/errorMiddleware');
const { authenticate, optionalAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// @route   GET /api/polls
// @desc    Get all polls
// @access  Public
router.get('/', optionalAuth, getAllPolls);

// @route   GET /api/polls/:id
// @desc    Get single poll
// @access  Public
router.get('/:id', optionalAuth, getPoll);

// @route   POST /api/polls
// @desc    Create new poll
// @access  Private
router.post('/', authenticate, validateRequest, createPoll);

// @route   POST /api/polls/:id/vote
// @desc    Vote on poll
// @access  Private
router.post('/:id/vote', authenticate, validateVote, validateRequest, voteOnPoll);

// @route   PUT /api/polls/:id
// @desc    Update poll
// @access  Private
router.put('/:id', authenticate, validateRequest, updatePoll);

// @route   DELETE /api/polls/:id
// @desc    Delete poll
// @access  Private
router.delete('/:id', authenticate, deletePoll);

module.exports = router;
