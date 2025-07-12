// app/api/admin/auth/send-otp/route.js
import adminDbConnect from '@/lib/adminDbConnect';
import AdminUser from '@/models/AdminUser';
import OTP from '@/models/OTP'; // New OTP model
import { sendEmail } from '@/lib/emailUtils'; // New email utility
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req) {
  await adminDbConnect();
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }

    const adminUser = await AdminUser.findOne({ email });
    if (!adminUser) {
      return NextResponse.json({ message: 'Admin user not found for this email.' }, { status: 404 });
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

    // Store OTP in DB
    // First, delete any old OTPs for this user/email
    await OTP.deleteMany({ adminId: adminUser._id });
    await OTP.create({
      adminId: adminUser._id,
      email: adminUser.email,
      otp,
      expiresAt,
    });

    // Send OTP via email
    const emailSubject = 'Your Admin Password Reset OTP';
    const emailHtml = `
      <p>Dear ${adminUser.name},</p>
      <p>You requested a password reset for your admin account. Your One-Time Password (OTP) is:</p>
      <h3>${otp}</h3>
      <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
      <p>Regards,<br>Your Admin System</p>
    `;

    await sendEmail(adminUser.email, emailSubject, emailHtml);

    return NextResponse.json({ message: 'OTP sent to your email.' }, { status: 200 });
  } catch (error) {
    console.error("Admin Send OTP error:", error);
    return NextResponse.json({ message: 'Failed to send OTP.', error: error.message }, { status: 500 });
  }
}