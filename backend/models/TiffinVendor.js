const mongoose = require('mongoose');

const tiffinVendorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A vendor must have a name']
  },
  location: {
    type: String,
    required: [true, 'A vendor must have a location']
  },
  daily_menu: {
    type: String
  }
});

module.exports = mongoose.model('TiffinVendor', tiffinVendorSchema);
