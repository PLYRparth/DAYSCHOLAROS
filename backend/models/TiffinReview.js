const mongoose = require('mongoose');

const tiffinReviewSchema = new mongoose.Schema({
  vendor_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'TiffinVendor',
    required: [true, 'Review must belong to a vendor']
  },
  reviewer_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Review must belong to a user']
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Review must have a rating between 1 and 5']
  },
  photo_url: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Compound unique index to ensure a user can only review a vendor once
tiffinReviewSchema.index({ vendor_id: 1, reviewer_id: 1 }, { unique: true });

module.exports = mongoose.model('TiffinReview', tiffinReviewSchema);
