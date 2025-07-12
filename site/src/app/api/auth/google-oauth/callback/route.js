// app/api/auth/google-oauth/callback/route.js
import dbConnect from '@/lib/dbConnect';
import UserProfile from '@/models/UserProfile';
import { NextResponse } from 'next/server';
import { oauth2Client } from '@/lib/googleOAuthUtils';
import { generateAccessToken, generateRefreshToken, setRefreshTokenCookie } from '@/lib/jwtUtils';
import { parse } from 'cookie'; // For parsing HttpOnly cookies
import bcrypt from 'bcryptjs'; // To hash refresh tokens before storing
import { serialize } from 'cookie'; // Add this import

export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');


    // Add this early in your callback route
    console.log("Request URL:", req.url);
    console.log("All Headers:", Object.fromEntries(req.headers.entries()));

    if (error) {
      console.error("Google OAuth Error:", error);
      return NextResponse.redirect(new URL('/login?error=google_oauth_failed', req.url));
    }

    if (!code || !state) {
      return NextResponse.redirect(new URL('/login?error=missing_oauth_params', req.url));
    }

    // Verify state from cookie
    const cookies = parse(req.headers.get('cookie') || '');


console.log("Parsed Cookies:", {
  oauth_state: cookies.oauth_state,
  oauth_code_verifier: cookies.oauth_code_verifier ? "EXISTS" : "MISSING",
  state_match: state === cookies.oauth_state
});


    const storedState = cookies.oauth_state;
    const storedCodeVerifier = cookies.oauth_code_verifier;

    if (state !== storedState) {
      console.error("State mismatch in Google OAuth callback.");
      return NextResponse.redirect(new URL('/login?error=state_mismatch', req.url));
    }

    if (!storedCodeVerifier) {
      console.error("Code verifier not found in Google OAuth callback.");
      return NextResponse.redirect(new URL('/login?error=code_verifier_missing', req.url));
    }

    // Exchange authorization code for tokens
// Replace your token exchange code with:
let tokens;
try {
  const tokenResponse = await oauth2Client.getToken({
    code,
    codeVerifier: storedCodeVerifier, // Note the parameter name change!
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI,
  });
  tokens = tokenResponse.tokens;
  console.log("Token Exchange Successful", { 
    access_token: tokens.access_token ? "EXISTS" : "MISSING",
    id_token: tokens.id_token ? "EXISTS" : "MISSING" 
  });
} catch (err) {
  console.error("Detailed Token Exchange Error:", {
    error: err.message,
    response: err.response?.data,
    code_verifier_passed: !!storedCodeVerifier,
    code_verifier_length: storedCodeVerifier?.length,
    redirect_uri_match: process.env.GOOGLE_OAUTH_REDIRECT_URI === 'http://localhost:3000/api/auth/google-oauth/callback'
  });
  throw err;
}

    oauth2Client.setCredentials(tokens);
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name;
    const profilePicture = payload.picture;

    let user = await UserProfile.findOne({ $or: [{ googleId }, { email }] });

    if (!user) {
      // Create new user if not found
      // Ensure unique username if needed, or generate one
      const username = `google_user_${googleId}`; // Simple username for Google users
      user = await UserProfile.create({
        userId: `user_${Date.now()}`, // Or use a UUID
        name,
        username,
        email,
        isGoogleLogin: true,
        googleId,
        profilePicture,
        isverified: true, // Google verified email by default
        lastlogindate: new Date(),
        lastloginip: req.headers.get('x-forwarded-for') || req.ip || 'Unknown',
        sessionVersion: 0, // Initial session version
        refreshTokens: [],
      });
    } else {
      // Update existing user (e.g., link Google ID if not already linked, update profile picture)
      if (!user.googleId) {
        user.googleId = googleId;
      }
      if (!user.profilePicture) {
        user.profilePicture = profilePicture;
      }
      user.lastlogindate = new Date();
      user.lastloginip = req.headers.get('x-forwarded-for') || req.ip || 'Unknown';
      user.isverified = true; // Ensure email is verified if logging in via Google
      await user.save();
    }

    // Generate your app's JWTs
    const accessToken = generateAccessToken({
      userId: user._id,
      username: user.username,
      email: user.email,
      sessionVersion: user.sessionVersion,
    });

    const refreshToken = generateRefreshToken({
      userId: user._id,
      sessionVersion: user.sessionVersion,
    });

    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const refreshTokenExpiresAt = new Date(Date.now() + (parseInt(process.env.REFRESH_TOKEN_EXPIRATION) * 24 * 60 * 60 * 1000 || 7 * 24 * 60 * 60 * 1000));

    user.refreshTokens.push({
      token: hashedRefreshToken,
      expiresAt: refreshTokenExpiresAt,
      ipAddress: req.headers.get('x-forwarded-for') || req.ip || 'Unknown',
      userAgent: req.headers.get('user-agent') || 'Unknown',
    });
    await user.save();

    // Redirect to homepage with access token (or handle via client-side in AuthContext)
    // For a seamless experience, we'll redirect to the homepage and let AuthContext pick up the session.
    const redirectUrl = new URL('/', req.url); // Redirect to homepage

    const response = NextResponse.redirect(redirectUrl);

    // Set HttpOnly cookie for refresh token
    const cookieHeader = setRefreshTokenCookie(null, refreshToken, refreshTokenExpiresAt);
    response.headers.set('Set-Cookie', cookieHeader);

    // Also set the access token in a non-HttpOnly cookie or pass it in URL hash for client-side pick-up
    // For this setup, AuthContext's initial load logic will handle fetching user data with the refresh token.
    // However, for immediate access, passing it in a hash or query param might be considered (less secure).
    // For simplicity, we'll rely on AuthContext's refresh logic on the homepage.
    // If you want to pass accessToken directly:
    // redirectUrl.hash = `accessToken=${accessToken}`; // Less secure, but immediate client-side access
    // Or set a regular cookie (not HttpOnly) for accessToken if needed by client-side JS immediately.
// Set cookies

// Add user data to the response
response.headers.append('Set-Cookie', serialize('initialUserData', JSON.stringify({
  userId: user._id,
  username: user.username,
  email: user.email,
  name: user.name,
  profilePicture: user.profilePicture
}), {
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 60 // 1 minute - just enough time for client to pick it up
}));



response.headers.append('Set-Cookie', serialize('accessTokenClient', accessToken, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
}));

    // Clear the temporary OAuth cookies
    response.headers.append('Set-Cookie', serialize('oauth_state', '', { expires: new Date(0), path: '/' }));
    response.headers.append('Set-Cookie', serialize('oauth_code_verifier', '', { expires: new Date(0), path: '/' }));


    console.log("Callback → Code:", code);
    console.log("Callback → State:", state);
    console.log("Callback → Stored Code Verifier:", storedCodeVerifier);
    console.log("Callback → Cookies:", req.headers.get("cookie"));

    return response;

  } catch (error) {
    console.error("Error handling Google OAuth callback:", error);
    return NextResponse.redirect(new URL('/login?error=google_oauth_processing_failed', req.url));
  }
}
