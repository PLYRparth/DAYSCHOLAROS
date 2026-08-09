const mongoose = require('mongoose');

const studyMaterialSchema = new mongoose.Schema({
  uploader_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Material must have an uploader']
  },
  title: {
    type: String,
    required: [true, 'Material must have a title']
  },
  subject_tag: {
    type: String,
    required: [true, 'Material must have a subject tag']
  },
  file_url: {
    type: String,
    required: [true, 'Material must have a file URL']
  },
  fileHash: {
    type: String, // SHA-256 for deduping
    required: [true, 'Material must have a file hash'],
    unique: true
  },
  upvotes: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('StudyMaterial', studyMaterialSchema);
