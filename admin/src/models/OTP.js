// models/OTP.js
import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminUser',
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: true, // For faster lookup by email
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL index for automatic expiration
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const OTP = mongoose.models.OTP || mongoose.model('OTP', OTPSchema);
export default OTP;