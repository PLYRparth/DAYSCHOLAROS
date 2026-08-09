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
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 1200 // TTL index: Document will automatically be deleted 1200 seconds (20 mins) after createdAt
  }
});

const CommuteRequest = mongoose.model('CommuteRequest', commuteRequestSchema);

module.exports = CommuteRequest;
