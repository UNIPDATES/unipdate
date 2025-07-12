import mongoose from 'mongoose';

const InternshipSchema = new mongoose.Schema({
  // Main heading (e.g., Job Title, Company Name)
  mainHeading: {
    type: String,
    required: true,
  },
  // Short description of the internship
  shortDescription: {
    type: String,
    required: true,
  },
  // Detailed content about the internship (responsibilities, requirements, etc.)
  content: {
    type: String,
    required: true,
  },
  // URL for the main image (e.g., company logo)
  mainImg: {
    type: String,
  },
  // Array of URLs for other images (e.g., team photos, office pics)
  otherImgs: [{
    type: String,
  }],
  // Application deadline
  deadline: {
    type: Date,
  },
  // Link to apply for the internship
  applicationLink: {
    type: String,
  },
  // Posted date
  postedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.models.Internship || mongoose.model('Internship', InternshipSchema);