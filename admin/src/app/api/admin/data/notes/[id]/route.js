// app/api/admin/data/notes/[id]/route.js (for the Admin Project)
import adminDbConnect from '@/lib/adminDbConnect';
import Note from '@/models/Note'; // Import public website's Note model
import { NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuthMiddleware'; // Admin auth middleware

// GET a single note document by its MongoDB _id (requires superadmin only)
export const GET = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const note = await Note.findById(id);
    if (!note) {
      return NextResponse.json({ message: 'Note document not found' }, { status: 404 });
    }
    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error fetching note with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to fetch note', error: error.message }, { status: 500 });
  }
}, ['superadmin']); // Permissions: Only superadmin

// PUT (update) a note document by its MongoDB _id (requires superadmin only)
export const PUT = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const body = await req.json();
    const updatedNote = await Note.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatedNote) {
      return NextResponse.json({ message: 'Note document not found' }, { status: 404 });
    }
    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error updating note with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to update note', error: error.message }, { status: 400 });
  }
}, ['superadmin']); // Permissions: Only superadmin

// DELETE a note document by its MongoDB _id (requires superadmin only)
export const DELETE = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
      return NextResponse.json({ message: 'Note document not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Note deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error deleting note with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to delete note', error: error.message }, { status: 500 });
  }
}, ['superadmin']); // Permissions: Only superadmin