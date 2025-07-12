// models/Contact.js (for the Admin Project)
import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserProfile', // Assuming UserProfile is in the same DB and accessible
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000, // Limit message length
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
    enum: ['pending', 'resolved'],
    default: 'pending',
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser', // To track which admin resolved it
    default: null,
  },
  resolvedAt: {
    type: Date,
    default: null,
  },
}, { timestamps: true }); // Adds createdAt and updatedAt

const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
export default Contact;