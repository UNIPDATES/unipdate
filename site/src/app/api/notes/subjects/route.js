// app/api/notes/subjects/route.js
import dbConnect from '@/lib/dbConnect';
import Note from '@/models/Note';
import { NextResponse } from 'next/server';

/**
 * @route GET /api/notes/subjects
 * @description Get all unique subjects from the notes collection.
 * @returns {Response} A JSON array of unique subject strings.
 */
export async function GET() {
  await dbConnect();
  try {
    const subjects = await Note.distinct('subject');
    return NextResponse.json(subjects, { status: 200 });
  } catch (error) {
    console.error("Error fetching unique subjects:", error);
    return NextResponse.json({ message: 'Failed to fetch subjects', error: error.message }, { status: 500 });
  }
}

// POST method is not typically used directly for 'subjects' in this design,
// as subjects are created implicitly when a new Note document is added.
// However, if you want to explicitly add a subject without a topic/content yet,
// you could implement it to create a Note document with just the subject field.
