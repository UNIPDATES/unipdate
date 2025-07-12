// app/api/admin/data/notes/subjects/[subjectName]/route.js (for the Admin Project)
import adminDbConnect from '@/lib/adminDbConnect';
import Note from '@/models/Note'; // Import public website's Note model
import { NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuthMiddleware'; // Admin auth middleware

// GET all topics and their associated content for a given subject (requires superadmin only)
export const GET = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { subjectName } = params;
  try {
    const decodedSubjectName = decodeURIComponent(subjectName);
    // No role-based filtering here, as only superadmin can access this endpoint
    const notes = await Note.find({ subject: decodedSubjectName }).select('topic pdfNotes importantQuestions playlists');
    if (notes.length === 0) {
      return NextResponse.json({ message: 'No notes found for this subject' }, { status: 404 });
    }
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error fetching topics for subject ${subjectName}:`, error);
    return NextResponse.json({ message: 'Failed to fetch topics', error: error.message }, { status: 500 });
  }
}, ['superadmin']); // Permissions: Only superadmin