// app/api/auth/refresh-token/route.js
import dbConnect from '@/lib/dbConnect';
import UserProfile from '@/models/UserProfile';
import { NextResponse } from 'next/server';
import { generateAccessToken, generateRefreshToken, setRefreshTokenCookie, verifyRefreshToken } from '@/lib/jwtUtils';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await dbConnect();
  try {
    // Get refresh token from cookie
    const cookieHeader = req.headers.get('cookie');
    const cookies = cookieHeader ? Object.fromEntries(cookieHeader.split('; ').map(c => c.split('='))) : {};
    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
      const response = NextResponse.json({ message: 'No refresh token provided.' }, { status: 401 });
      response.headers.set('Set-Cookie', clearRefreshTokenCookie());
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

    // Check if the refresh token's sessionVersion matches the user's current sessionVersion
    // This is how "logout from all devices" invalidates old refresh tokens.
    if (decodedRefreshToken.sessionVersion !== user.sessionVersion) {
      const response = NextResponse.json({ message: 'Session invalidated. Please log in again.' }, { status: 401 });
      response.headers.set('Set-Cookie', clearRefreshTokenCookie());
      return response;
    }

    // Verify the refresh token exists in the database (hashed) and is not expired
    const storedTokenDoc = user.refreshTokens.find(async (tokenDoc) => {
      const isMatch = await bcrypt.compare(refreshToken, tokenDoc.token);
      return isMatch && tokenDoc.expiresAt > new Date(); // Check match and expiration
    });

    if (!storedTokenDoc) {
      const response = NextResponse.json({ message: 'Refresh token not found or expired in DB.' }, { status: 401 });
      response.headers.set('Set-Cookie', clearRefreshTokenCookie());
      return response;
    }

    // Generate a new Access Token
    const newAccessToken = generateAccessToken({
      userId: user._id,
      username: user.username,
      email: user.email,
      sessionVersion: user.sessionVersion,
    });

    // Optionally: Implement Refresh Token Rotation (generate new refresh token, invalidate old one)
    // For simplicity, we'll just return a new access token with the existing refresh token.
    // In a real app, you would:
    // 1. Remove `storedTokenDoc` from `user.refreshTokens`.
    // 2. Generate a `newRefreshToken`.
    // 3. Hash `newRefreshToken` and push it to `user.refreshTokens`.
    // 4. Set `newRefreshToken` as an HttpOnly cookie.

    const response = NextResponse.json({
      message: 'Access token refreshed successfully.',
      accessToken: newAccessToken,
    }, { status: 200 });

    // If you implemented rotation, you'd set the new refresh token cookie here.
    // response.headers.set('Set-Cookie', setRefreshTokenCookie(null, newRefreshToken, newRefreshTokenExpiresAt));

    return response;

  } catch (error) {
    console.error("Error refreshing token:", error);
    const response = NextResponse.json({ message: 'Failed to refresh token.', error: error.message }, { status: 500 });
    response.headers.set('Set-Cookie', clearRefreshTokenCookie());
    return response;
  }
}