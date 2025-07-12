// app/api/auth/login/route.js
import dbConnect from '@/lib/dbConnect';
import UserProfile from '@/models/UserProfile';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, setRefreshTokenCookie } from '@/lib/jwtUtils';

export async function POST(req) {
  await dbConnect();
  try {
    const { emailOrUsername, password } = await req.json();

    if (!emailOrUsername || !password) {
      return NextResponse.json({ message: 'Email/Username and password are required.' }, { status: 400 });
    }

    const user = await UserProfile.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials.' }, { status: 401 });
    }

    if (!user.isGoogleLogin && !user.isverified) {
      return NextResponse.json({ message: 'Email not verified. Please verify your email to log in.' }, { status: 403 });
    }

    // Get client IP address and User Agent
    const ip = req.headers.get('x-forwarded-for') || req.ip || 'Unknown';
    const userAgent = req.headers.get('user-agent') || 'Unknown';

    // Update last login date and IP
    user.lastlogindate = new Date();
    user.lastloginip = ip;

    // Generate Tokens
    const accessToken = generateAccessToken({
      userId: user._id,
      username: user.username,
      email: user.email,
      sessionVersion: user.sessionVersion, // Include session version in access token
    });

    const refreshToken = generateRefreshToken({
      userId: user._id,
      sessionVersion: user.sessionVersion, // Include session version in refresh token
    });

    // Hash refresh token before saving to DB
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

    // Calculate refresh token expiration date for DB and cookie
    const refreshTokenExpiresAt = new Date(Date.now() + (parseInt(process.env.REFRESH_TOKEN_EXPIRATION) * 24 * 60 * 60 * 1000 || 7 * 24 * 60 * 60 * 1000)); // Default 7 days

    // Store the hashed refresh token in the user's document
    user.refreshTokens.push({
      token: hashedRefreshToken,
      expiresAt: refreshTokenExpiresAt,
      ipAddress: ip,
      userAgent: userAgent,
    });

    await user.save();

    // Set HttpOnly cookie for refresh token
    const cookieHeader = setRefreshTokenCookie(null, refreshToken, refreshTokenExpiresAt);

    const response = NextResponse.json({
      message: 'Login successful.',
      accessToken,
      user: {
        _id: user._id,
        userId: user.userId,
        name: user.name,
        username: user.username,
        email: user.email,
        isverified: user.isverified,
        lastlogindate: user.lastlogindate,
        lastloginip: user.lastloginip,
        sessionVersion: user.sessionVersion,
      },
    }, { status: 200 });

    response.headers.set('Set-Cookie', cookieHeader);
    return response;

  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ message: 'Login failed.', error: error.message }, { status: 500 });
  }
}