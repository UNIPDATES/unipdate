// app/api/auth/forgot-password/route.js
import dbConnect from '@/lib/dbConnect';
import UserProfile from '@/models/UserProfile';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await dbConnect();
  try {
    const { email, newPassword, otpVerified } = await req.json();

    if (!email || !newPassword || !otpVerified) {
      return NextResponse.json({ message: 'Email, new password, and OTP verification status are required.' }, { status: 400 });
    }

    // IMPORTANT: This API assumes OTP has *already* been verified successfully
    // by the frontend calling /api/auth/verify-otp.
    // In a production system, you might want a temporary token from /verify-otp
    // to secure this step, rather than just a boolean flag.
    if (!otpVerified) {
        return NextResponse.json({ message: 'OTP not verified. Please verify your OTP first.' }, { status: 403 });
    }

    const user = await UserProfile.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    return NextResponse.json({ message: 'Password reset successfully.' }, { status: 200 });
  } catch (error) {
    console.error("Error resetting password:", error);
    return NextResponse.json({ message: 'Failed to reset password.', error: error.message }, { status: 500 });
  }
}