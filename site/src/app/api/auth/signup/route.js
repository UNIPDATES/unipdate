// app/api/auth/signup/route.js
import dbConnect from '@/lib/dbConnect';
import UserProfile from '@/models/UserProfile';
import OTP from '@/models/OTP'; // Import the OTP model
import { sendEmail, generateOTP } from '@/lib/emailUtils'; // Import email utilities
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs'; // For password hashing

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const { name, passoutYear,college, username, email, password } = body;

    // Basic validation
    if (!name || !passoutYear ||!college|| !username || !email || !password) {
      return NextResponse.json({ message: 'All fields are required.' }, { status: 400 });
    }

    // Check if user with email or username already exists
    const existingUser = await UserProfile.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      // Provide a more specific error message if possible
      if (existingUser.email === email) {
        return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 });
      }
      if (existingUser.username === username) {
        return NextResponse.json({ message: 'User with this username already exists.' }, { status: 409 });
      }
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate a unique userId (can be a UUID in a real app, or MongoDB's _id if you prefer)
    // Using a simple timestamp-based ID for demonstration
    const newUserId = `user_${Date.now()}`;

    const newUser = await UserProfile.create({
      userId: newUserId,
      name,
      passoutYear: parseInt(passoutYear), // Ensure it's stored as a number
      college, // Store college name
      username,
      email,
      password: hashedPassword,
      isGoogleLogin: false,
      isverified: false, // New users are not verified by default, requires OTP verification
      lastlogindate: null, // Set on first successful login
      lastloginip: null, // Set on first successful login
      sessionVersion: 0, // Initialize session version for new user
      refreshTokens: [], // Initialize empty array for refresh tokens
    });

    // --- INTEGRATED OTP SENDING LOGIC ---
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10); // Hash OTP for storage

    // Delete any existing OTPs for this email to prevent issues
    await OTP.deleteMany({ email });

    // Save new OTP to DB
    await OTP.create({ email, otp: hashedOtp });

    const emailSubject = 'UniUpdates Email Verification OTP';
    const emailText = `Your UniUpdates email verification OTP is: ${otp}. It is valid for 5 minutes.`;
    const emailHtml = `<p>Your UniUpdates email verification OTP is: <strong>${otp}</strong></p>
                       <p>It is valid for 5 minutes. Do not share this with anyone.</p>`;

    await sendEmail(email, emailSubject, emailText, emailHtml);
    // --- END INTEGRATED OTP SENDING LOGIC ---

    // Exclude sensitive information from the response
    const { password: _, refreshTokens: __, ...userWithoutSensitiveData } = newUser.toObject();

    return NextResponse.json({ message: 'Signup successful. Please verify your email.', user: userWithoutSensitiveData }, { status: 201 });
  } catch (error) {
    console.error("Error during signup:", error);
    return NextResponse.json({ message: 'Signup failed.', error: error.message }, { status: 500 });
  }
}
