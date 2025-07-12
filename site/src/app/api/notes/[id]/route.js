// app/api/notes/[id]/route.js
import dbConnect from '@/lib/dbConnect';
import Note from '@/models/Note';
import { NextResponse } from 'next/server';

/**
 * @route GET /api/notes/:id
 * @description Get a single note document by its MongoDB _id.
 * @param {Object} request - The request object.
 * @param {Object} { params } - Object containing route parameters.
 * @param {string} params.id - The MongoDB _id of the note document.
 * @returns {Response} The note document.
 */
export async function GET(request, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const note = await Note.findById(id);
    if (!note) {
      return NextResponse.json({ message: 'Note document not found' }, { status: 404 });
    }
    return NextResponse.json(note, { status: 200 });
  } catch (error) {
    console.error(`Error fetching note with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to fetch note', error: error.message }, { status: 500 });
  }
}

/**
 * @route PUT /api/notes/:id
 * @description Update a note document by its MongoDB _id.
 * @param {Request} req - The incoming request object.
 * @param {Object} { params } - Object containing route parameters.
 * @param {string} params.id - The MongoDB _id of the note document to update.
 * @returns {Response} The updated note document.
 */
export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const body = await req.json();
    const updatedNote = await Note.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatedNote) {
      return NextResponse.json({ message: 'Note document not found' }, { status: 404 });
    }
    return NextResponse.json(updatedNote, { status: 200 });
  } catch (error) {
    console.error(`Error updating note with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to update note', error: error.message }, { status: 400 });
  }
}

/**
 * @route DELETE /api/notes/:id
 * @description Delete a note document by its MongoDB _id.
 * @param {Object} request - The request object.
 * @param {Object} { params } - Object containing route parameters.
 * @param {string} params.id - The MongoDB _id of the note document to delete.
 * @returns {Response} A success message.
 */
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const deletedNote = await Note.findByIdAndDelete(id);
    if (!deletedNote) {
      return NextResponse.json({ message: 'Note document not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Note deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting note with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to delete note', error: error.message }, { status: 500 });
  }
}
