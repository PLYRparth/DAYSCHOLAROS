const mongoose = require('mongoose');

const commuteRequestSchema = new mongoose.Schema({
  creator_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A commute request must have a creator']
  },
  start_point: {
    type: String,
    required: [true, 'A commute request must have a start point']
  },
  destination: {
    type: String,
    required: [true, 'A commute request must have a destination']
  },
  participants: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    }
  ],
  roomId: {
    type: String, // Can map to socket.io room ID
    required: true,
    unique: true
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  memberLimit: {
    type: Number,
    default: 4,
    min: 2,
    max: 10
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // TTL index: Document will automatically be deleted 3600 seconds (1 hr) after createdAt
  }
});

const CommuteRequest = mongoose.model('CommuteRequest', commuteRequestSchema);

module.exports = CommuteRequest;
