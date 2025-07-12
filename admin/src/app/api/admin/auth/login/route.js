// app/api/admin/auth/login/route.js
import adminDbConnect from '@/lib/adminDbConnect';
import AdminUser from '@/models/AdminUser';
import { generateAdminAccessToken, generateAdminRefreshToken } from '@/lib/adminJwtUtils';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await adminDbConnect();
  
  try {
    // 1. Get and sanitize input
    const { usernameOrEmail, password: rawPassword } = await req.json();
    const password = String(rawPassword).trim();

    if (!usernameOrEmail || !password) {
      return NextResponse.json(
        { message: 'Username/email and password are required.' }, 
        { status: 400 }
      );
    }

    // 2. Find user with password explicitly selected
    const adminUser = await AdminUser.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    }).select('+password +refreshTokens +sessionVersion');

    if (!adminUser) {
      return NextResponse.json(
        { message: 'Invalid credentials.' }, 
        { status: 401 }
      );
    }

    // 3. Verify password
    const isMatch = await bcrypt.compare(password, adminUser.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Invalid credentials.' }, 
        { status: 401 }
      );
    }

    // 4. Generate tokens
    const accessToken = generateAdminAccessToken(adminUser._id, adminUser.role, adminUser.sessionVersion);
    const refreshToken = generateAdminRefreshToken(adminUser._id, adminUser.sessionVersion);

    // 5. Update refresh tokens (limit to 5 most recent)
    adminUser.refreshTokens = [
      ...adminUser.refreshTokens.slice(-4), // Keep last 4
      refreshToken // Add new one
    ];
    await adminUser.save();

    // 6. Prepare response
    const { password: _, refreshTokens: __, ...safeUserData } = adminUser.toObject();
    
    const response = NextResponse.json({
      message: 'Login successful',
      accessToken,
      adminUser: safeUserData
    }, { status: 200 });

    // 7. Set secure cookie
    response.cookies.set('admin_refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: parseInt(process.env.ADMIN_REFRESH_TOKEN_EXPIRATION_MS, 10) / 1000,
      path: '/api/admin/auth/refresh-token',
      sameSite: 'strict'
    });

    return response;

  } catch (error) {
    console.error("Admin Login error:", error);
    return NextResponse.json(
      { message: 'Authentication failed', error: error.message },
      { status: 500 }
    );
  }
}