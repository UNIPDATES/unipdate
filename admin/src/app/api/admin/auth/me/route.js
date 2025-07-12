// app/api/admin/auth/me/route.js
import { NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuthMiddleware'; // Use the middleware for protected route

// Get current authenticated admin user's details
export const GET = adminAuthMiddleware(async (req) => {
  try {
    const adminUser = req.adminUser; // User data is attached by the middleware

    // Prepare response without sensitive info
    const { password: _, refreshTokens: __, ...adminUserWithoutSensitiveData } = adminUser.toObject();

    return NextResponse.json(adminUserWithoutSensitiveData, { status: 200 });
  } catch (error) {
    console.error("Admin 'me' API error:", error);
    return NextResponse.json({ message: 'Failed to retrieve admin user data.', error: error.message }, { status: 500 });
  }
}, ['superadmin', 'uniadmin']); // Both superadmin and uniadmin can access their own 'me' data