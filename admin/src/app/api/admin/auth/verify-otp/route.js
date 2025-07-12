// app/api/admin/auth/verify-otp/route.js
import adminDbConnect from '@/lib/adminDbConnect';
import AdminUser from '@/models/AdminUser';
import OTP from '@/models/OTP';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await adminDbConnect();
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ message: 'Email and OTP are required.' }, { status: 400 });
    }

    const adminUser = await AdminUser.findOne({ email });
    if (!adminUser) {
      return NextResponse.json({ message: 'Admin user not found.' }, { status: 404 });
    }

    // Find the latest OTP for this user
    const storedOTP = await OTP.findOne({
      adminId: adminUser._id,
      email: adminUser.email,
    }).sort({ createdAt: -1 }); // Get the most recent one

    if (!storedOTP || storedOTP.otp !== otp || storedOTP.expiresAt < new Date()) {
      // Delete used/invalid OTP to prevent replay attacks
      if (storedOTP) {
        await OTP.findByIdAndDelete(storedOTP._id);
      }
      return NextResponse.json({ message: 'Invalid or expired OTP.' }, { status: 400 });
    }

    // OTP is valid. Delete it to prevent reuse.
    await OTP.findByIdAndDelete(storedOTP._id);

    return NextResponse.json({ message: 'OTP verified successfully.' }, { status: 200 });
  } catch (error) {
    console.error("Admin Verify OTP error:", error);
    return NextResponse.json({ message: 'Failed to verify OTP.', error: error.message }, { status: 500 });
  }
}