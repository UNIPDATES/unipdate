// app/api/auth/logout/route.js
import dbConnect from '@/lib/dbConnect';
import UserProfile from '@/models/UserProfile';
import { NextResponse } from 'next/server';
import { clearRefreshTokenCookie, verifyRefreshToken } from '@/lib/jwtUtils';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await dbConnect();
  try {
    // Get refresh token from cookie
    const cookieHeader = req.headers.get('cookie');
    const cookies = cookieHeader ? Object.fromEntries(cookieHeader.split('; ').map(c => c.split('='))) : {};
    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
      const response = NextResponse.json({ message: 'No active session to log out.' }, { status: 400 });
      response.headers.set('Set-Cookie', clearRefreshTokenCookie()); // Ensure cookie is cleared
      return response;
    }

    const decodedRefreshToken = verifyRefreshToken(refreshToken);

    if (!decodedRefreshToken || !decodedRefreshToken.userId) {
      const response = NextResponse.json({ message: 'Invalid refresh token.' }, { status: 401 });
      response.headers.set('Set-Cookie', clearRefreshTokenCookie()); // Clear invalid cookie
      return response;
    }

    const user = await UserProfile.findById(decodedRefreshToken.userId);

    if (!user) {
      const response = NextResponse.json({ message: 'User not found.' }, { status: 404 });
      response.headers.set('Set-Cookie', clearRefreshTokenCookie());
      return response;
    }

    // Find and remove the specific refresh token from the user's document
    user.refreshTokens = user.refreshTokens.filter(async (tokenDoc) => {
      // Compare the hashed token from DB with the provided refresh token
      const isMatch = await bcrypt.compare(refreshToken, tokenDoc.token);
      return !isMatch; // Keep tokens that don't match the one being logged out
    });

    await user.save();

    const response = NextResponse.json({ message: 'Logged out successfully from this device.' }, { status: 200 });
    response.headers.set('Set-Cookie', clearRefreshTokenCookie()); // Clear the refresh token cookie
    return response;

  } catch (error) {
    console.error("Error during logout:", error);
    const response = NextResponse.json({ message: 'Logout failed.', error: error.message }, { status: 500 });
    response.headers.set('Set-Cookie', clearRefreshTokenCookie()); // Clear cookie on error too
    return response;
  }
}