// app/api/admin/data/users/[id]/route.js (for the Admin Project)
import adminDbConnect from '@/lib/adminDbConnect';
import UserProfile from '@/models/UserProfile'; // Import public website's UserProfile model
import { NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuthMiddleware'; // Admin auth middleware
import bcrypt from 'bcryptjs'; // For hashing passwords if updating manually

// GET a single public user by ID (requires admin role: superadmin)
export const GET = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    // Exclude sensitive info like password and refreshTokens
    const user = await UserProfile.findById(id).select('-password -refreshTokens');
    if (!user) {
      return NextResponse.json({ message: 'Public user not found' }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error fetching public user with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to fetch public user', error: error.message }, { status: 500 });
  }
}, ['superadmin']);

// PUT (update) a public user by ID (requires admin role: superadmin)
export const PUT = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const body = await req.json();
    // Destructure specific fields that might need special handling or exclusion
    let {
      password,
      isverified, // This is the field from your schema
      isGoogleLogin, // Should not be changed via admin PUT
      googleId,      // Should not be changed via admin PUT
      userId,        // Should not be changed via admin PUT
      lastlogindate, // Managed by login process, not admin PUT
      lastloginip,   // Managed by login process, not admin PUT
      sessionVersion, // Managed by auth system, not admin PUT
      refreshTokens,  // Managed by auth system, not admin PUT
      ...updates // Collect all other fields for direct update
    } = body;

    const user = await UserProfile.findById(id);
    if (!user) {
      return NextResponse.json({ message: 'Public user not found' }, { status: 404 });
    }

    // Handle password update if provided
    if (password) {
      // Only update password if it's a non-Google login or if explicitly allowed for Google users (rare)
      // Your existing logic for password update is retained.
      if (user.isGoogleLogin && !user.password) {
        // If it's a Google user without a password, might be setting one
      }
      updates.password = await bcrypt.hash(password, 10);
    }

    // Explicitly allow updating 'isverified' status
    if (typeof isverified !== 'undefined') {
      updates.isverified = isverified;
    }

    // Apply updates to the user profile
    // Note: Mongoose's findByIdAndUpdate will apply 'updates' object.
    // Fields like isGoogleLogin, googleId, userId, lastlogindate, lastloginip,
    // sessionVersion, and refreshTokens are explicitly excluded from 'updates'
    // by destructuring them out, ensuring they are not modified by this route.
    const updatedUser = await UserProfile.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select('-password -refreshTokens');

    if (!updatedUser) {
      return NextResponse.json({ message: 'Public user update failed.' }, { status: 500 });
    }
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error updating public user with ID ${id}:`, error);
    if (error.code === 11000) { // MongoDB duplicate key error (e.g., if username or email is changed to an existing one)
      return NextResponse.json({ message: 'User with this email or username already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to update public user', error: error.message }, { status: 400 });
  }
}, ['superadmin']);

// DELETE a public user by ID (requires admin role: superadmin)
export const DELETE = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const deletedUser = await UserProfile.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json({ message: 'Public user not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Public user deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error deleting public user with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to delete public user', error: error.message }, { status: 500 });
  }
}, ['superadmin']);
