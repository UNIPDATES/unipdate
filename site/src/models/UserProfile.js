// models/UserProfile.js
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
  college: {
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
  isverified: {
    type: Boolean,
    default: false, // Indicates if the user's email is verified
  },
  lastlogindate: {
    type: Date,
    default: null, // Will be set on first successful login
  },
  lastloginip: {
    type: String, // IP address of the last login
    default: null, // Will be set on first successful login
  },
  // NEW FIELD for session management: Incremented to invalidate all previous sessions
  sessionVersion: {
    type: Number,
    default: 0,
  },
  // NEW FIELD for refresh token management: Store hashed refresh tokens
  // This allows for explicit revocation of individual refresh tokens.
  refreshTokens: [{
    token: { type: String, required: true }, // Hashed refresh token
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    ipAddress: { type: String },
    userAgent: { type: String },
  }],
}, { timestamps: true }); // Adds createdAt and updatedAt fields

export default mongoose.models.UserProfile || mongoose.model('UserProfile', UserProfileSchema);