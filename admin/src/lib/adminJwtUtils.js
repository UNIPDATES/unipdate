// // lib/adminJwtUtils.js (for the Admin Project)
// import jwt from 'jsonwebtoken';
// import { serialize } from 'cookie'; // Only import serialize here, not in the model

// // Ensure these are set in your .env.local for the ADMIN PROJECT
// const ADMIN_ACCESS_TOKEN_SECRET = process.env.ADMIN_ACCESS_TOKEN_SECRET;
// const ADMIN_REFRESH_TOKEN_SECRET = process.env.ADMIN_REFRESH_TOKEN_SECRET;
// const ADMIN_ACCESS_TOKEN_EXPIRATION = process.env.ADMIN_ACCESS_TOKEN_EXPIRATION || '30m'; // Shorter for admin
// const ADMIN_REFRESH_TOKEN_EXPIRATION = process.env.ADMIN_REFRESH_TOKEN_EXPIRATION || '3d'; // Shorter for admin

// if (!ADMIN_ACCESS_TOKEN_SECRET || !ADMIN_REFRESH_TOKEN_SECRET) {
//   throw new Error('Admin JWT secrets are not fully defined in environment variables for the admin project.');
// }

// // --- Admin JWT Functions ---

// /**
//  * Generates an access token for an admin user.
//  * @param {object} payload - The payload to include in the token (e.g., adminId, username, email, role, sessionVersion).
//  * @returns {string} The generated admin access token.
//  */
// export const generateAdminAccessToken = (payload) => {
//   return jwt.sign(payload, ADMIN_ACCESS_TOKEN_SECRET, { expiresIn: ADMIN_ACCESS_TOKEN_EXPIRATION });
// };

// /**
//  * Generates a refresh token for an admin user.
//  * @param {object} payload - The payload to include in the token (e.g., adminId, sessionVersion).
//  * @returns {string} The generated admin refresh token.
//  */
// export const generateAdminRefreshToken = (payload) => {
//   return jwt.sign(payload, ADMIN_REFRESH_TOKEN_SECRET, { expiresIn: ADMIN_REFRESH_TOKEN_EXPIRATION });
// };

// /**
//  * Verifies an admin access token.
//  * @param {string} token - The admin access token to verify.
//  * @returns {object|null} The decoded payload if valid, null otherwise.
//  */
// export const verifyAdminAccessToken = (token) => {
//   try {
//     return jwt.verify(token, ADMIN_ACCESS_TOKEN_SECRET);
//   } catch (error) {
//     return null; // Token is invalid or expired
//   }
// };

// /**
//  * Verifies an admin refresh token.
//  * @param {string} token - The admin refresh token to verify.
//  * @returns {object|null} The decoded payload if valid, null otherwise.
//  */
// export const verifyAdminRefreshToken = (token) => {
//   try {
//     return jwt.verify(token, ADMIN_REFRESH_TOKEN_SECRET);
//   } catch (error) {
//     return null; // Token is invalid or expired
//   }
// };

// /**
//  * Sets an HttpOnly refresh token cookie in the response headers for admin.
//  * @param {NextResponse} response - The Next.js response object.
//  * @param {string} refreshToken - The refresh token to set.
//  * @param {Date} expiresAt - The expiration date for the cookie.
//  * @returns {void}
//  */
// export const setAdminRefreshTokenCookie = (response, refreshToken, expiresAt) => {
//   const cookieName = 'adminRefreshToken';
//   const cookiePath = '/api/admin'; // Scope cookie to admin API paths

//   const cookieOptions = {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === 'production', // Use secure in production
//     sameSite: 'lax',
//     path: cookiePath,
//     expires: expiresAt,
//   };

//   response.headers.append('Set-Cookie', serialize(cookieName, refreshToken, cookieOptions));
// };







// lib/adminJwtUtils.js
import jwt from 'jsonwebtoken';

const ADMIN_ACCESS_TOKEN_SECRET = process.env.ADMIN_ACCESS_TOKEN_SECRET;
const ADMIN_REFRESH_TOKEN_SECRET = process.env.ADMIN_REFRESH_TOKEN_SECRET;
const ADMIN_ACCESS_TOKEN_EXPIRATION_MS = parseInt(process.env.ADMIN_ACCESS_TOKEN_EXPIRATION_MS, 10);
const ADMIN_REFRESH_TOKEN_EXPIRATION_MS = parseInt(process.env.ADMIN_REFRESH_TOKEN_EXPIRATION_MS, 10);

if (!ADMIN_ACCESS_TOKEN_SECRET || !ADMIN_REFRESH_TOKEN_SECRET || isNaN(ADMIN_ACCESS_TOKEN_EXPIRATION_MS) || isNaN(ADMIN_REFRESH_TOKEN_EXPIRATION_MS)) {
  console.error("Missing or invalid Admin JWT environment variables!");
  process.exit(1);
}

export const generateAdminAccessToken = (adminId, role, sessionVersion) => {
  return jwt.sign(
    { adminId, role, sessionVersion },
    ADMIN_ACCESS_TOKEN_SECRET,
    { expiresIn: `${ADMIN_ACCESS_TOKEN_EXPIRATION_MS / 1000}s` } // convert ms to seconds
  );
};

export const generateAdminRefreshToken = (adminId, sessionVersion) => {
  return jwt.sign(
    { adminId, sessionVersion },
    ADMIN_REFRESH_TOKEN_SECRET,
    { expiresIn: `${ADMIN_REFRESH_TOKEN_EXPIRATION_MS / 1000}s` } // convert ms to seconds
  );
};

export const verifyAdminAccessToken = (token) => {
  try {
    return jwt.verify(token, ADMIN_ACCESS_TOKEN_SECRET);
  } catch (error) {
    return null; // Token is invalid or expired
  }
};

export const verifyAdminRefreshToken = (token) => {
  try {
    return jwt.verify(token, ADMIN_REFRESH_TOKEN_SECRET);
  } catch (error) {
    return null; // Token is invalid or expired
  }
};