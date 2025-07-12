import mongoose from 'mongoose';

const UniUpdateSchema = new mongoose.Schema({
  // ID of the user who sent/posted the update
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProfile', // References the UserProfile schema
    required: true,
  },
  // Unique ID of the university
  uniId: {
    type: String, // Or mongoose.Schema.Types.ObjectId if you have a separate Uni schema
    required: true,
  },
  // Name of the university
  uniName: {
    type: String,
    required: true,
  },
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

export default mongoose.models.UniUpdate || mongoose.model('UniUpdate', UniUpdateSchema);