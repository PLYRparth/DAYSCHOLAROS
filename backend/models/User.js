const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(el) {
        // Validates for .edu.in or specific college domain (e.g., @college.edu.in)
        return /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9.-]+\.)?edu\.in$/.test(el);
      },
      message: 'Please provide a valid college domain email (.edu.in)'
    }
  },
  passwordHash: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false // Do not return by default
  },
  reliabilityScore: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 10
  },
  storageQuotaUsed: {
    type: Number, // in bytes
    default: 0
  },
  reportsFiledThisWeek: {
    type: Number,
    default: 0
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  accountCreatedAt: {
    type: Date,
    default: Date.now
  },
  pushSubscription: {
    type: Object,
    default: null
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
