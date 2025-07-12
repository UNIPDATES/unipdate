// models/College.js (for the Admin Project)
import mongoose from 'mongoose';

const CollegeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true, // Ensure college codes are consistent
  },
  // To track the number of active uniadmins for this college
  uniAdminCount: {
    type: Number,
    default: 0,
    min: 0,
    max: 2, // Enforce max 2 uniadmins per college at the schema level
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

export default mongoose.models.College || mongoose.model('College', CollegeSchema);
