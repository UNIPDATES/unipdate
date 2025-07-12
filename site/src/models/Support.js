// models/Support.js (for the Admin Project)
import mongoose from 'mongoose';

const SupportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProfile', // Assuming UserProfile is in the same DB and accessible
    required: true,
  },
  subject: { // Added a subject for support tickets
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000, // Longer message for support
  },
  relatedWith: {
    type: String,
    enum: ['global', 'college'],
    required: true,
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College', // Assuming College model is in the same DB and accessible
    required: function() {
      // College ID is required if relatedWith is 'college'
      return this.relatedWith === 'college';
    },
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'closed'],
    default: 'open',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser', // To assign support tickets to specific admins
    default: null,
  },
  lastAdminReply: { // To track the last time an admin responded
    type: String,
    trim: true,
    maxlength: 1000,
    default: null,
  },
  lastAdminReplyAt: {
    type: Date,
    default: null,
  }
}, { timestamps: true }); // Adds createdAt and updatedAt

const Support = mongoose.models.Support || mongoose.model('Support', SupportSchema);
export default Support;

