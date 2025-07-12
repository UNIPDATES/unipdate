// app/api/admin/data/notes/route.js (for the Admin Project)
import adminDbConnect from '@/lib/adminDbConnect';
import Note from '@/models/Note'; // Import public website's Note model
import { NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuthMiddleware'; // Admin auth middleware

// GET all notes documents (requires superadmin only)
export const GET = adminAuthMiddleware(async (req) => {
  await adminDbConnect();
  try {
    // No role-based filtering here, as only superadmin can access this endpoint
    const notes = await Note.find({});
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error("Admin API - Error fetching notes:", error);
    return NextResponse.json({ message: 'Failed to fetch notes', error: error.message }, { status: 500 });
  }
}, ['superadmin']); // Permissions: Only superadmin

// POST a new note document (requires superadmin only)
export const POST = adminAuthMiddleware(async (req) => {
  await adminDbConnect();
  try {
    const body = await req.json();

    const newNote = await Note.create(body);
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error("Admin API - Error creating note:", error);
    return NextResponse.json({ message: 'Failed to create note', error: error.message }, { status: 400 });
  }
}, ['superadmin']); // Permissions: Only superadmin
