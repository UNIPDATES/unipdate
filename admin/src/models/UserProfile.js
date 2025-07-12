import mongoose from 'mongoose';

const UserProfileSchema = new mongoose.Schema({
  // Unique identifier for the user
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  // User's full name
  name: {
    type: String,
    required: true,
  },
  // Year of passing out from college
  passoutYear: {
    type: Number,
    required: function() {
      return !this.isGoogleLogin; // Required if not a Google login
    },
  },
  college:{
    type: String, // College name, required for manual logins
    required: function() {
      return !this.isGoogleLogin; // Required if not a Google login
    }
  },
  // Unique username for the user
  username: {
    type: String,
    required: true,
    unique: true,
  },
  // User's email address
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // Hashed password for manual logins (not required for Google logins)
  password: {
    type: String,
    required: function() {
      return !this.isGoogleLogin; // Required if not a Google login
    },
  },
  // Flag to indicate if the user logged in via Google
  isGoogleLogin: {
    type: Boolean,
    default: false,
  },
  // Google ID if logged in via Google
  googleId: {
    type: String,
    sparse: true, // Allows null values, but unique if not null
  },
  // Profile picture URL (e.g., from Google profile)
  profilePicture: {
    type: String,
  },
}, { timestamps: true }); // Adds createdAt and updatedAt fields

export default mongoose.models.UserProfile || mongoose.model('UserProfile', UserProfileSchema);