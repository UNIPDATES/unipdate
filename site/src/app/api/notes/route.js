// app/api/notes/route.js
import dbConnect from '@/lib/dbConnect';
import Note from '@/models/Note';
import { NextResponse } from 'next/server';

/**
 * @route GET /api/notes
 * @description Get all notes documents.
 * @returns {Response} A JSON array of note documents.
 */
export async function GET() {
  await dbConnect();
  try {
    const notes = await Note.find({});
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return NextResponse.json({ message: 'Failed to fetch notes', error: error.message }, { status: 500 });
  }
}

/**
 * @route POST /api/notes
 * @description Create a new note document (can be a new subject/topic).
 * @param {Request} req - The incoming request object.
 * @returns {Response} The newly created note document.
 */
export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    // You might want to add logic here to check if subject/topic already exists
    // and update an existing document instead of creating a new one,
    // or ensure uniqueness in your frontend/business logic.
    const newNote = await Note.create(body);
    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json({ message: 'Failed to create note', error: error.message }, { status: 400 });
  }
}
