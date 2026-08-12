const mongoose = require('mongoose');

const marketplaceItemSchema = new mongoose.Schema({
  seller_id: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Item must belong to a seller']
  },
  category: {
    type: String,
    required: [true, 'Item must have a category']
  },
  price: {
    type: Number,
    required: [true, 'Item must have a price']
  },
  description: {
    type: String,
    required: [true, 'Item must have a description']
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/300?text=No+Image'
  },
  whatsappNumber: {
    type: String,
    required: [true, 'Please provide a WhatsApp number for contact']
  }
});

// Pre-save hook to reject UPI IDs and Phone Numbers in description
marketplaceItemSchema.pre('save', function() {
  // Regex to detect UPI IDs (e.g., name@okicici, phone@paytm, name@sbi)
  const upiRegex = /[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}/;
  
  // Regex to detect Phone numbers (basic 10 digit, with optional country code, spaces, dashes)
  const phoneRegex = /(?:\+91|91)?\s?[-]?\s?[6-9]\d{9}/;

  if (upiRegex.test(this.description) || phoneRegex.test(this.description)) {
    throw new Error('Validation failed: For security, description cannot contain UPI IDs or phone numbers. Please use the platform chat.');
  }
});

module.exports = mongoose.model('MarketplaceItem', marketplaceItemSchema);
