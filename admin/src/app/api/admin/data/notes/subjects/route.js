// app/api/admin/data/notes/subjects/route.js (for the Admin Project)
import adminDbConnect from '@/lib/adminDbConnect';
import Note from '@/models/Note'; // Import public website's Note model
import { NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuthMiddleware'; // Admin auth middleware

// GET all unique subjects from the notes collection (requires superadmin only)
export const GET = adminAuthMiddleware(async (req) => {
  await adminDbConnect();
  try {
    // No role-based filtering here, as only superadmin can access this endpoint
    const subjects = await Note.distinct('subject');
    return NextResponse.json(subjects, { status: 200 });
  } catch (error) {
    console.error("Admin API - Error fetching unique subjects:", error);
    return NextResponse.json({ message: 'Failed to fetch subjects', error: error.message }, { status: 500 });
  }
}, ['superadmin']); // Permissions: Only superadmin