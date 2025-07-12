// app/api/admin/data/admin-users/[id]/route.js (for the Admin Project)
import adminDbConnect from '@/lib/adminDbConnect';
import AdminUser from '@/models/AdminUser';
import College from '@/models/College'; // Import College model
import { NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuthMiddleware';
import bcrypt from 'bcryptjs';

// GET a single admin user by ID (requires superadmin)
export const GET = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const adminUser = await AdminUser.findById(id).select('-password -refreshTokens').populate('college', 'name code');
    if (!adminUser) {
      return NextResponse.json({ message: 'Admin user not found' }, { status: 404 });
    }
    return NextResponse.json(adminUser, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error fetching admin user with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to fetch admin user', error: error.message }, { status: 500 });
  }
}, ['superadmin']); // Only superadmin can view individual admin users

// PUT (update) an admin user by ID (requires superadmin)
export const PUT = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const body = await req.json();
    const { role, college, password, ...otherUpdates } = body;

    const adminUser = await AdminUser.findById(id);
    if (!adminUser) {
      return NextResponse.json({ message: 'Admin user not found' }, { status: 404 });
    }

    // --- Role Change and College Assignment/Unassignment Logic (Superadmin Control) ---
    // This section ensures superadmin can correctly modify roles and college assignments,
    // adhering to the uniadmin count limit per college.

    if (role && role !== adminUser.role) {
      // If changing from uniadmin, decrement count from old college
      if (adminUser.role === 'uniadmin' && adminUser.college) {
        await College.findByIdAndUpdate(adminUser.college, { $inc: { uniAdminCount: -1 } });
      }

      // If changing TO uniadmin, validate and increment count for new college
      if (role === 'uniadmin') {
        if (!college) {
          return NextResponse.json({ message: 'College is required when setting role to uniadmin.' }, { status: 400 });
        }
        const targetCollege = await College.findById(college);
        if (!targetCollege) {
          return NextResponse.json({ message: 'Assigned college not found.' }, { status: 404 });
        }
        if (targetCollege.uniAdminCount >= 2) {
          return NextResponse.json({ message: `College ${targetCollege.name} already has maximum uniadmins (2).` }, { status: 409 });
        }
        await College.findByIdAndUpdate(college, { $inc: { uniAdminCount: 1 } });
        otherUpdates.college = college; // Set the new college ID
      } else if (role === 'superadmin') {
        // If changing TO superadmin, ensure no college is assigned
        otherUpdates.college = undefined;
      }
      otherUpdates.role = role; // Set the new role
    } else if (role === 'uniadmin' && college && college.toString() !== adminUser.college?.toString()) {
      // --- Handle College Change for an Existing Uniadmin ---
      // This applies if the role remains 'uniadmin' but the college itself is being changed.
      const oldCollegeId = adminUser.college;
      const newCollegeId = college;

      const newTargetCollege = await College.findById(newCollegeId);
      if (!newTargetCollege) {
        return NextResponse.json({ message: 'New assigned college not found.' }, { status: 404 });
      }
      if (newTargetCollege.uniAdminCount >= 2) {
        return NextResponse.json({ message: `College ${newTargetCollege.name} already has maximum uniadmins (2).` }, { status: 409 });
      }

      // Decrement count for old college (if one was assigned)
      if (oldCollegeId) {
        await College.findByIdAndUpdate(oldCollegeId, { $inc: { uniAdminCount: -1 } });
      }
      // Increment count for new college
      await College.findByIdAndUpdate(newCollegeId, { $inc: { uniAdminCount: 1 } });
      otherUpdates.college = newCollegeId; // Update college reference
    }

    // --- Password Change and Session Invalidation ---
    if (password) {
      otherUpdates.password = await bcrypt.hash(password, 10);
      // Increment session version to invalidate all current sessions for this admin
      otherUpdates.sessionVersion = adminUser.sessionVersion + 1;
      otherUpdates.refreshTokens = []; // Clear all refresh tokens on password change
    }

    // Apply all collected updates to the admin user document
    Object.assign(adminUser, otherUpdates);
    await adminUser.save();

    // Exclude sensitive information from the response
    const { password: _, refreshTokens: __, ...adminUserWithoutSensitiveData } = adminUser.toObject();

    return NextResponse.json(adminUserWithoutSensitiveData, { message: 'Admin user updated successfully.', status: 200 });
  } catch (error) {
    console.error(`Admin API - Error updating admin user with ID ${id}:`, error);
    if (error.code === 11000) {
      return NextResponse.json({ message: 'Admin with this email or username already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to update admin user', error: error.message }, { status: 400 });
  }
}, ['superadmin']); // Only superadmin can update admin users

// DELETE an admin user by ID (requires superadmin)
export const DELETE = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const deletedAdminUser = await AdminUser.findByIdAndDelete(id);
    if (!deletedAdminUser) {
      return NextResponse.json({ message: 'Admin user not found' }, { status: 404 });
    }

    // If the deleted admin was a uniadmin, decrement the college's uniAdminCount
    if (deletedAdminUser.role === 'uniadmin' && deletedAdminUser.college) {
      await College.findByIdAndUpdate(deletedAdminUser.college, { $inc: { uniAdminCount: -1 } });
    }

    return NextResponse.json({ message: 'Admin user deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error deleting admin user with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to delete admin user', error: error.message }, { status: 500 });
  }
}, ['superadmin']); // Only superadmin can delete admin users
