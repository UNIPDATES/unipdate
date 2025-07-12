// app/api/admin/auth/logout-all-devices/route.js
import adminDbConnect from '@/lib/adminDbConnect';
import AdminUser from '@/models/AdminUser';
import { NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuthMiddleware'; // Use the middleware for protected route

// Only an authenticated admin (any role) can log out all devices
export const POST = adminAuthMiddleware(async (req) => {
  await adminDbConnect();
  try {
    const adminUser = req.adminUser; // Admin user from middleware

    // Increment sessionVersion to invalidate all existing tokens
    adminUser.sessionVersion += 1;
    adminUser.refreshTokens = []; // Clear all refresh tokens
    await adminUser.save();

    // Clear the current refresh token cookie
    const response = NextResponse.json({ message: 'Logged out from all devices successfully. Please log in again.' }, { status: 200 });
    response.cookies.delete('admin_refreshToken', { path: '/api/admin/auth/refresh-token' });

    return response;
  } catch (error) {
    console.error("Admin Logout All Devices error:", error);
    return NextResponse.json({ message: 'Internal server error.', error: error.message }, { status: 500 });
  }
}, ['superadmin', 'uniadmin']); // Both superadmin and uniadmin can log out all their own devices