const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Option text is required'],
    trim: true,
    maxlength: [100, 'Option text cannot exceed 100 characters']
  },
  votes: {
    type: Number,
    default: 0,
    min: [0, 'Votes cannot be negative']
  }
});

const pollSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'Question is required'],
    trim: true,
    minlength: [5, 'Question must be at least 5 characters'],
    maxlength: [200, 'Question cannot exceed 200 characters']
  },
  options: {
    type: [optionSchema],
    required: [true, 'Poll must have options'],
    validate: {
      validator: function(options) {
        return options.length >= 2 && options.length <= 5;
      },
      message: 'Poll must have between 2 and 5 options'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Poll creator is required']
  },
  expiresAt: {
    type: Date,
    validate: {
      validator: function(value) {
        return !value || value > new Date();
      },
      message: 'Expiration date must be in the future'
    }
  },
  votedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
pollSchema.index({ createdBy: 1 });
pollSchema.index({ expiresAt: 1 });
pollSchema.index({ isActive: 1 });

// Virtual for total votes
pollSchema.virtual('totalVotes').get(function() {
  return this.options.reduce((sum, option) => sum + option.votes, 0);
});

// Method to check if poll is expired
pollSchema.methods.isExpired = function() {
  return this.expiresAt && this.expiresAt < new Date();
};

// Method to check if user has voted
pollSchema.methods.hasUserVoted = function(userId) {
  return this.votedUsers.includes(userId);
};

// Method to add vote
pollSchema.methods.addVote = function(optionIndex, userId) {
  if (this.hasUserVoted(userId)) {
    throw new Error('User has already voted on this poll');
  }
  
  if (this.isExpired()) {
    throw new Error('Poll has expired');
  }
  
  if (optionIndex < 0 || optionIndex >= this.options.length) {
    throw new Error('Invalid option index');
  }
  
  this.options[optionIndex].votes += 1;
  this.votedUsers.push(userId);
  
  return this.save();
};

module.exports = mongoose.model('Poll', pollSchema);
