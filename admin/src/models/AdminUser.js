// models/AdminUser.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Numans } from 'next/font/google';

const AdminUserSchema = new mongoose.Schema({
    img_url:{
    type: String,
    required: false,
    },
    name:{
    type: String,
    required: true,
    trim: true,
    },


  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
  },
  pno: {
    type: Number,
    required: false,
    unique: true,
    validate: {
        validator: function(v) {
            return /\d{10}/.test(v); // Validate as a 10-digit number
        },
        message: props => `${props.value} is not a valid phone number!`
        }   
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['superadmin', 'uniadmin'],
    required: true,
    default: 'uniadmin',
  },
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    // Only required if role is 'uniadmin'
    required: function() { return this.role === 'uniadmin'; },
    default: null,
  },
  passoutyear: {
    type: Number,
    required: true,
    min: 1900,
    max: new Date().getFullYear() + 5, // Up to 5 years in the future for current students
  },
  refreshTokens: [String], // Array to store multiple refresh tokens for multiple sessions
  sessionVersion: { // Incremented on password change or "logout all devices" to invalidate old tokens
    type: Number,
    default: 0,
  },
  ordersfromsuperadmin: {
    type: Array,
    default: [],
  },
  terminate:{
    type: Boolean,
    default: false, // Indicates if the admin user is terminated
  },
  terminationreason:{
    type: String,
    default: null,  
  }
}, { timestamps: true });

// Hash password before saving
AdminUserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare passwords
AdminUserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);
export default AdminUser;

