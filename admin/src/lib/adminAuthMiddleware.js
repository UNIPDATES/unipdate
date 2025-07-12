// lib/adminAuthMiddleware.js (for the Admin Project)
import { NextResponse } from 'next/server';
import { verifyAdminAccessToken } from '@/lib/adminJwtUtils'; // Admin-specific JWT utils
import AdminUser from '@/models/AdminUser'; // AdminUser model for session version check
import adminDbConnect from '@/lib/adminDbConnect'; // Admin-specific DB connection

/**
 * Middleware to authenticate and authorize admin users for API routes.
 * @param {Function} handler - The actual API route handler (e.g., GET, POST, PUT, DELETE).
 * @param {string[]} requiredRoles - An array of roles required to access this route (e.g., ['superadmin', 'uniadmin']).
 * @returns {Function} An async function that wraps the handler with auth logic.
 */
export const adminAuthMiddleware = (handler, requiredRoles = ['superadmin']) => async (req, { params }) => {
  await adminDbConnect(); // Ensure DB connection for adminUser lookup

  try {
    const authHeader = req.headers.get('Authorization');
    const accessToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!accessToken) {
      return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
    }

    const decodedToken = verifyAdminAccessToken(accessToken);

    if (!decodedToken || !decodedToken.adminId) {
      return NextResponse.json({ message: 'Invalid or expired access token.' }, { status: 401 });
    }

    const adminUser = await AdminUser.findById(decodedToken.adminId);

    if (!adminUser) {
      return NextResponse.json({ message: 'Admin user not found.' }, { status: 404 });
    }

    // Check session version to ensure token is not revoked
    if (decodedToken.sessionVersion !== adminUser.sessionVersion) {
      return NextResponse.json({ message: 'Session invalidated. Please log in again.' }, { status: 401 });
    }

    // Role-based Access Control (RBAC)
    if (!requiredRoles.includes(adminUser.role)) {
      return NextResponse.json({ message: 'Forbidden: Insufficient permissions.' }, { status: 403 });
    }

    // Attach admin user data to the request for the handler to use
    // This is crucial for uniadmin to access their college ID
    req.adminUser = adminUser;

    // Proceed to the actual API route handler
    return handler(req, { params });

  } catch (error) {
    console.error("Admin authentication/authorization error:", error);
    return NextResponse.json({ message: 'Internal server error during authentication.', error: error.message }, { status: 500 });
  }
};
