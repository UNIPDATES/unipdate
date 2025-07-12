// models/Featured.js
const mongoose = require('mongoose'); // Use require for Mongoose model definition

const featuredSchema = new mongoose.Schema({
  img: {
    type: String,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  createdOn: {
    type: Date,
    default: Date.now,
  },
  tagLine: {
    type: String,
    required: true,
    trim: true,
    maxlength: 250, // Added a max length for tagline
  },
});

// Use mongoose.models to prevent recompilation issues in Next.js development mode
const Featured = mongoose.models.Featured || mongoose.model('Featured', featuredSchema);

module.exports = Featured; // Use module.exports for consistency with your existing models
