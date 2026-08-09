const mongoose = require('mongoose');

const housingReviewSchema = new mongoose.Schema({
  reviewer_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A housing review must have a reviewer']
  },
  location: {
    type: String,
    required: [true, 'A housing review must specify a location/address']
  },
  wifi_speed: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please rate the WiFi speed (1-5)']
  },
  landlord_interference: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, 'Please rate landlord interference (1-5)']
  },
  hidden_charges: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HousingReview', housingReviewSchema);
