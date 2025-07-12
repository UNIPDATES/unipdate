// models/featured.js
import mongoose from 'mongoose';

const featuredSchema = new mongoose.Schema({
  img: {
    type: String,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  tagLine: {
    type: String,
    required: true,
    trim: true
  }
});
export default mongoose.models.featuredSchema || mongoose.model('Featured', featuredSchema);