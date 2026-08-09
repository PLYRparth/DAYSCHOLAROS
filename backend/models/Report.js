const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporter_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A report must have a reporter']
  },
  target_type: {
    type: String,
    enum: ['User', 'CommuteRequest', 'MarketplaceItem', 'Review', 'Note', 'Message'], // Extensible across features
    required: [true, 'A report must have a target type']
  },
  target_id: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'A report must have a target id']
  },
  reason: {
    type: String,
    required: [true, 'A report must have a reason']
  },
  status: {
    type: String,
    enum: ['pending', 'upheld', 'dismissed'],
    default: 'pending'
  },
  appeal_text: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

// Ensure a user can only report a specific target once (optional but good practice)
reportSchema.index({ reporter_id: 1, target_type: 1, target_id: 1 }, { unique: true });

const Report = mongoose.model('Report', reportSchema);

module.exports = Report;
