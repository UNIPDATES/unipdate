import mongoose from 'mongoose';

const GlobalUpdateSchema = new mongoose.Schema({
  // Main heading of the update
  mainHeading: {
    type: String,
    required: true,
  },
  // Short description or summary of the update
  shortDescription: {
    type: String,
    required: true,
  },
  // Full content of the update
  content: {
    type: String,
    required: true,
  },
  // URL for the main image
  mainImg: {
    type: String,
  },
  // Array of URLs for additional images
  otherImgs: [{
    type: String,
  }],
  // Date when the update was published
  publishedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.models.GlobalUpdate || mongoose.model('GlobalUpdate', GlobalUpdateSchema);