// app/api/uni-updates/[id]/route.js
import dbConnect from '@/lib/dbConnect';
import UniUpdate from '@/models/UniUpdate';
import { NextResponse } from 'next/server';

/**
 * @route GET /api/uni-updates/:id
 * @description Get a single university update by ID.
 * @param {Object} request - The request object.
 * @param {Object} { params } - Object containing route parameters.
 * @param {string} params.id - The ID of the university update.
 * @returns {Response} The university update object.
 */
export async function GET(request, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const uniUpdate = await UniUpdate.findById(id);
    if (!uniUpdate) {
      return NextResponse.json({ message: 'University update not found' }, { status: 404 });
    }
    return NextResponse.json(uniUpdate, { status: 200 });
  } catch (error) {
    console.error(`Error fetching university update with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to fetch university update', error: error.message }, { status: 500 });
  }
}

/**
 * @route PUT /api/uni-updates/:id
 * @description Update a university update by ID.
 * @param {Request} req - The incoming request object.
 * @param {Object} { params } - Object containing route parameters.
 * @param {string} params.id - The ID of the university update to update.
 * @returns {Response} The updated university update object.
 */
export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const body = await req.json();
    const updatedUniUpdate = await UniUpdate.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatedUniUpdate) {
      return NextResponse.json({ message: 'University update not found' }, { status: 404 });
    }
    return NextResponse.json(updatedUniUpdate, { status: 200 });
  } catch (error) {
    console.error(`Error updating university update with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to update university update', error: error.message }, { status: 400 });
  }
}

/**
 * @route DELETE /api/uni-updates/:id
 * @description Delete a university update by ID.
 * @param {Object} request - The request object.
 * @param {Object} { params } - Object containing route parameters.
 * @param {string} params.id - The ID of the university update to delete.
 * @returns {Response} A success message.
 */
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const deletedUniUpdate = await UniUpdate.findByIdAndDelete(id);
    if (!deletedUniUpdate) {
      return NextResponse.json({ message: 'University update not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'University update deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting university update with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to delete university update', error: error.message }, { status: 500 });
  }
}
