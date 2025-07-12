// app/api/notes/subjects/[subjectName]/route.js
import dbConnect from '@/lib/dbConnect';
import Note from '@/models/Note';
import { NextResponse } from 'next/server';

/**
 * @route GET /api/notes/subjects/:subjectName
 * @description Get all topics and their associated content for a given subject.
 * @param {Object} request - The request object.
 * @param {Object} { params } - Object containing route parameters.
 * @param {string} params.subjectName - The name of the subject.
 * @returns {Response} A JSON array of note documents for the specified subject.
 */
export async function GET(request, { params }) {
  await dbConnect();
  const { subjectName } = params;
  try {
    // Decode the subject name if it contains URL-encoded characters (e.g., spaces)
    const decodedSubjectName = decodeURIComponent(subjectName);
    const notes = await Note.find({ subject: decodedSubjectName }).select('topic pdfNotes importantQuestions playlists');
    if (notes.length === 0) {
      return NextResponse.json({ message: 'No notes found for this subject' }, { status: 404 });
    }
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error(`Error fetching topics for subject ${subjectName}:`, error);
    return NextResponse.json({ message: 'Failed to fetch topics', error: error.message }, { status: 500 });
  }
}

