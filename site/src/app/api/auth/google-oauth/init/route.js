// app/api/auth/google-oauth/init/route.js
import { NextResponse } from 'next/server';
import { generateGoogleAuthUrl } from '@/lib/googleOAuthUtils';
import { serialize } from 'cookie'; // For setting HttpOnly cookies

export async function GET() {
  try {
    const { url, state, codeVerifier } = generateGoogleAuthUrl();

    const response = NextResponse.redirect(url);

    // Set HttpOnly cookies for state and codeVerifier
    // These are crucial for security (CSRF protection and PKCE)
// In your init route, update cookie settings
response.headers.set('Set-Cookie', serialize('oauth_state', state, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api/auth/google-oauth', // More specific path
  maxAge: 60 * 5, // 5 minutes
}));

response.headers.append('Set-Cookie', serialize('oauth_code_verifier', codeVerifier, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/api/auth/google-oauth', // More specific path
  maxAge: 60 * 5, // 5 minutes
}));

    console.log("OAuth Init → CodeVerifier:", codeVerifier);
    console.log("OAuth Init → State:", state);
    console.log("OAuth Init → Redirect URL:", url);


    return response;
  } catch (error) {
    console.error("Error initiating Google OAuth:", error);
    return NextResponse.json({ message: 'Failed to initiate Google login.', error: error.message }, { status: 500 });
  }
}
