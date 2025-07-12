// app/api/auth/send-otp/route.js
import dbConnect from '@/lib/dbConnect';
import UserProfile from '@/models/UserProfile';
import OTP from '@/models/OTP';
import { sendEmail, generateOTP } from '@/lib/emailUtils';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs'; // For hashing OTP before saving to DB

export async function POST(req) {
  await dbConnect();
  try {
    const { email, type } = await req.json(); // type: 'verification' or 'forgot-password'

    if (!email || !type) {
      return NextResponse.json({ message: 'Email and type are required.' }, { status: 400 });
    }

    const user = await UserProfile.findOne({ email });

    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOtp = await bcrypt.hash(otp, 10); // Hash OTP for storage

    // Delete any existing OTPs for this email to prevent issues
    await OTP.deleteMany({ email });

    // Save new OTP to DB
    await OTP.create({ email, otp: hashedOtp });

    let emailSubject = '';
    let emailText = '';
    let emailHtml = '';

    if (type === 'verification') {
      emailSubject = 'UniUpdates Email Verification OTP';
      emailText = `Your UniUpdates email verification OTP is: ${otp}. It is valid for 5 minutes.`;
      emailHtml = `<p>Your UniUpdates email verification OTP is: <strong>${otp}</strong></p>
                   <p>It is valid for 5 minutes. Do not share this with anyone.</p>`;
    } else if (type === 'forgot-password') {
      emailSubject = 'UniUpdates Password Reset OTP';
      emailText = `Your UniUpdates password reset OTP is: ${otp}. It is valid for 5 minutes.`;
      emailHtml = `<p>Your UniUpdates password reset OTP is: <strong>${otp}</strong></p>
                   <p>It is valid for 5 minutes. Do not share this with anyone.</p>`;
    } else {
      return NextResponse.json({ message: 'Invalid OTP type.' }, { status: 400 });
    }

    await sendEmail(email, emailSubject, emailText, emailHtml);

    return NextResponse.json({ message: 'OTP sent successfully.' }, { status: 200 });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return NextResponse.json({ message: 'Failed to send OTP.', error: error.message }, { status: 500 });
  }
}