// app/api/auth/me/route.js
import dbConnect from '@/lib/dbConnect';
import UserProfile from '@/models/UserProfile';
import { NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/jwtUtils';

export async function GET(req) {
  await dbConnect();
  try {
    // Get access token from Authorization header
    const authHeader = req.headers.get('Authorization');
    const accessToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!accessToken) {
      return NextResponse.json({ message: 'No access token provided.' }, { status: 401 });
    }

    const decodedToken = verifyAccessToken(accessToken);

    if (!decodedToken || !decodedToken.userId) {
      return NextResponse.json({ message: 'Invalid or expired access token.' }, { status: 401 });
    }

    const user = await UserProfile.findById(decodedToken.userId);

    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Crucial: Check if the sessionVersion in the token matches the current one in the DB
    // If they don't match, it means a "logout all devices" event occurred.
    if (decodedToken.sessionVersion !== user.sessionVersion) {
      return NextResponse.json({ message: 'Session invalidated. Please log in again.' }, { status: 401 });
    }

    // Return user data (excluding sensitive information like password and refresh tokens)
    const { password, refreshTokens, ...userWithoutSensitiveData } = user.toObject();

    return NextResponse.json(userWithoutSensitiveData, { status: 200 });

  } catch (error) {
    console.error("Error fetching user data (auth/me):", error);
    return NextResponse.json({ message: 'Failed to fetch user data.', error: error.message }, { status: 500 });
  }
}
