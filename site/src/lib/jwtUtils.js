// lib/jwtUtils.js
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

// IMPORTANT: Store these securely in your .env.local file
// JWT_ACCESS_SECRET=a_very_strong_random_secret_for_access_tokens
// JWT_REFRESH_SECRET=another_very_strong_random_secret_for_refresh_tokens
// ACCESS_TOKEN_EXPIRATION=1h
// REFRESH_TOKEN_EXPIRATION=7d

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_TOKEN_EXPIRATION = process.env.ACCESS_TOKEN_EXPIRATION || '1h';
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || '7d';

if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error('JWT secrets are not defined in environment variables.');
}

/**
 * Generates an Access Token.
 * @param {object} payload - Data to include in the token (e.g., userId, sessionVersion).
 * @returns {string} The signed Access Token.
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });
};

/**
 * Generates a Refresh Token.
 * @param {object} payload - Data to include in the token (e.g., userId, sessionVersion).
 * @returns {string} The signed Refresh Token.
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
};

/**
 * Verifies an Access Token.
 * @param {string} token - The Access Token to verify.
 * @returns {object|null} The decoded payload if valid, null otherwise.
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Verifies a Refresh Token.
 * @param {string} token - The Refresh Token to verify.
 * @returns {object|null} The decoded payload if valid, null otherwise.
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Sets an HttpOnly cookie for the refresh token.
 * @param {string} res - Next.js Response object.
 * @param {string} token - The refresh token to set.
 * @param {Date} expiresAt - Expiration date of the cookie.
 */
export const setRefreshTokenCookie = (res, token, expiresAt) => {
  const cookie = serialize('refreshToken', token, {
    httpOnly: true, // Not accessible via client-side JavaScript
    secure: process.env.NODE_ENV === 'production', // Use secure in production (HTTPS)
    sameSite: 'lax', // Protects against CSRF attacks
    path: '/', // Accessible across the entire domain
    expires: expiresAt, // Set expiration date
  });
  // Next.js App Router sets headers differently
  // You'd typically add this header to the response object before returning it.
  // Example: res.headers.set('Set-Cookie', cookie);
  return cookie; // Return the cookie string to be set in headers
};

/**
 * Clears the refresh token cookie.
 */
export const clearRefreshTokenCookie = () => {
  const cookie = serialize('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: new Date(0), // Set expiration to past to delete
  });
  return cookie;
};