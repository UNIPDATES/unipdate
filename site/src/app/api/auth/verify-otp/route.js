// app/api/auth/verify-otp/route.js
import dbConnect from '@/lib/dbConnect';
import UserProfile from '@/models/UserProfile';
import OTP from '@/models/OTP';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await dbConnect();
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required.' }, { status: 400 });
    }

    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 }); // Get the latest OTP

    if (!otpRecord) {
      return NextResponse.json({ message: 'OTP not found or expired.' }, { status: 400 });
    }

    // Compare the provided OTP with the hashed OTP from the database
    const isMatch = await bcrypt.compare(otp, otpRecord.otp);

    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid OTP.' }, { status: 400 });
    }

    // If OTP is valid, mark user as verified and delete the OTP record
    const user = await UserProfile.findOneAndUpdate(
      { email },
      { isverified: true },
      { new: true }
    );

    await OTP.deleteMany({ email }); // Delete all OTPs for this email after successful verification

    return NextResponse.json({ message: 'Email verified successfully.', user }, { status: 200 });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return NextResponse.json({ message: 'Failed to verify OTP.', error: error.message }, { status: 500 });
  }
}