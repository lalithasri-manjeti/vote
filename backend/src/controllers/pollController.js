const Poll = require('../models/Poll');
const { asyncHandler } = require('../middleware/errorMiddleware');

// @desc    Get all polls
// @route   GET /api/polls
// @access  Public
const getAllPolls = asyncHandler(async (req, res) => {
  const { type = 'all', page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  let query = {};
  
  // Filter by type
  if (type === 'active') {
    query = {
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ],
      isActive: true
    };
  } else if (type === 'mine' && req.user) {
    query = { createdBy: req.user._id };
  }

  const polls = await Poll.find(query)
    .populate('createdBy', 'username')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Poll.countDocuments(query);

  res.json({
    success: true,
    data: {
      polls,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    }
  });
});

// @desc    Get single poll
// @route   GET /api/polls/:id
// @access  Public
const getPoll = asyncHandler(async (req, res) => {
  const poll = await Poll.findById(req.params.id)
    .populate('createdBy', 'username');

  if (!poll) {
    return res.status(404).json({
      success: false,
      message: 'Poll not found'
    });
  }

  res.json({
    success: true,
    data: { poll }
  });
});

// @desc    Create new poll
// @route   POST /api/polls
// @access  Private
const createPoll = asyncHandler(async (req, res) => {
  const { question, options, expiresAt } = req.body;

  // Transform options array to include votes
  const pollOptions = options.map(text => ({
    text: text.trim(),
    votes: 0
  }));

  const poll = await Poll.create({
    question: question.trim(),
    options: pollOptions,
    createdBy: req.user._id,
    expiresAt: expiresAt ? new Date(expiresAt) : undefined
  });

  await poll.populate('createdBy', 'username');

  res.status(201).json({
    success: true,
    message: 'Poll created successfully',
    data: { poll }
  });
});

// @desc    Vote on poll
// @route   POST /api/polls/:id/vote
// @access  Private
const voteOnPoll = asyncHandler(async (req, res) => {
  const { optionIndex } = req.body;
  const pollId = req.params.id;

  const poll = await Poll.findById(pollId);

  if (!poll) {
    return res.status(404).json({
      success: false,
      message: 'Poll not found'
    });
  }

  if (!poll.isActive) {
    return res.status(400).json({
      success: false,
      message: 'Poll is no longer active'
    });
  }

  if (poll.isExpired()) {
    return res.status(400).json({
      success: false,
      message: 'Poll has expired'
    });
  }

  if (poll.hasUserVoted(req.user._id)) {
    return res.status(400).json({
      success: false,
      message: 'You have already voted on this poll'
    });
  }

  if (optionIndex < 0 || optionIndex >= poll.options.length) {
    return res.status(400).json({
      success: false,
      message: 'Invalid option selected'
    });
  }

  await poll.addVote(optionIndex, req.user._id);

  res.json({
    success: true,
    message: 'Vote recorded successfully',
    data: { poll }
  });
});

// @desc    Update poll
// @route   PUT /api/polls/:id
// @access  Private
const updatePoll = asyncHandler(async (req, res) => {
  const poll = await Poll.findById(req.params.id);

  if (!poll) {
    return res.status(404).json({
      success: false,
      message: 'Poll not found'
    });
  }

  // Check if user is the creator
  if (poll.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this poll'
    });
  }

  // Check if poll has votes
  if (poll.totalVotes > 0) {
    return res.status(400).json({
      success: false,
      message: 'Cannot update poll that has votes'
    });
  }

  const { question, options, expiresAt } = req.body;

  if (question) poll.question = question.trim();
  if (options) {
    poll.options = options.map(text => ({
      text: text.trim(),
      votes: 0
    }));
  }
  if (expiresAt !== undefined) {
    poll.expiresAt = expiresAt ? new Date(expiresAt) : undefined;
  }

  await poll.save();
  await poll.populate('createdBy', 'username');

  res.json({
    success: true,
    message: 'Poll updated successfully',
    data: { poll }
  });
});

// @desc    Delete poll
// @route   DELETE /api/polls/:id
// @access  Private
const deletePoll = asyncHandler(async (req, res) => {
  const poll = await Poll.findById(req.params.id);

  if (!poll) {
    return res.status(404).json({
      success: false,
      message: 'Poll not found'
    });
  }

  // Check if user is the creator
  if (poll.createdBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this poll'
    });
  }

  await Poll.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: 'Poll deleted successfully'
  });
});

module.exports = {
  getAllPolls,
  getPoll,
  createPoll,
  voteOnPoll,
  updatePoll,
  deletePoll
};
