// app/api/admin/auth/forgot-password/route.js
import adminDbConnect from '@/lib/adminDbConnect';
import AdminUser from '@/models/AdminUser';
import OTP from '@/models/OTP';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await adminDbConnect();
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ message: 'Email, OTP, and new password are required.' }, { status: 400 });
    }

    const adminUser = await AdminUser.findOne({ email });
    if (!adminUser) {
      return NextResponse.json({ message: 'Admin user not found.' }, { status: 404 });
    }

    // Verify OTP (similar logic from verify-otp)
    const storedOTP = await OTP.findOne({
      adminId: adminUser._id,
      email: adminUser.email,
    }).sort({ createdAt: -1 });

    if (!storedOTP || storedOTP.otp !== otp || storedOTP.expiresAt < new Date()) {
      if (storedOTP) {
        await OTP.findByIdAndDelete(storedOTP._id); // Delete invalid OTP
      }
      return NextResponse.json({ message: 'Invalid or expired OTP.' }, { status: 400 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and invalidate all old sessions
    adminUser.password = hashedPassword;
    adminUser.sessionVersion += 1; // Invalidate all existing tokens
    adminUser.refreshTokens = []; // Clear all refresh tokens
    await adminUser.save();

    // Delete the used OTP
    await OTP.findByIdAndDelete(storedOTP._id);

    return NextResponse.json({ message: 'Password reset successfully.' }, { status: 200 });
  } catch (error) {
    console.error("Admin Forgot Password error:", error);
    return NextResponse.json({ message: 'Failed to reset password.', error: error.message }, { status: 500 });
  }
}