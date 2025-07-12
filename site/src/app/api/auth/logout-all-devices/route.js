// app/api/auth/logout-all-devices/route.js
import dbConnect from '@/lib/dbConnect';
import UserProfile from '@/models/UserProfile';
import { NextResponse } from 'next/server';
import { clearRefreshTokenCookie, verifyAccessToken } from '@/lib/jwtUtils';

export async function POST(req) {
  await dbConnect();
  try {
    // In a real app, you'd get the userId from an authenticated Access Token
    // For this example, we'll assume the Access Token is sent in the Authorization header
    const authHeader = req.headers.get('Authorization');
    const accessToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!accessToken) {
      return NextResponse.json({ message: 'Access token required.' }, { status: 401 });
    }

    const decodedAccessToken = verifyAccessToken(accessToken);

    if (!decodedAccessToken || !decodedAccessToken.userId) {
      return NextResponse.json({ message: 'Invalid access token.' }, { status: 401 });
    }

    const userId = decodedAccessToken.userId; // Get userId from the valid access token

    const user = await UserProfile.findById(userId);
    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Increment the sessionVersion to invalidate all previous sessions/tokens
    user.sessionVersion = (user.sessionVersion || 0) + 1;
    user.refreshTokens = []; // Clear all stored refresh tokens
    await user.save();

    // The current device's Access Token is now effectively invalid due to sessionVersion change.
    // The frontend should clear its tokens and redirect to login.

    const response = NextResponse.json({ message: 'Successfully logged out from all other devices. Please log in again.' }, { status: 200 });
    // Also clear the refresh token cookie for the current device immediately
    response.headers.set('Set-Cookie', clearRefreshTokenCookie());
    return response;

  } catch (error) {
    console.error("Error during logout from all devices:", error);
    const response = NextResponse.json({ message: 'Failed to logout from all devices.', error: error.message }, { status: 500 });
    response.headers.set('Set-Cookie', clearRefreshTokenCookie()); // Clear cookie on error too
    return response;
  }
}