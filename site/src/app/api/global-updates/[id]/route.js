// app/api/global-updates/[id]/route.js
import dbConnect from '@/lib/dbConnect';
import GlobalUpdate from '@/models/GlobalUpdate';
import { NextResponse } from 'next/server';

/**
 * @route GET /api/global-updates/:id
 * @description Get a single global update by ID.
 * @param {Object} request - The request object.
 * @param {Object} { params } - Object containing route parameters.
 * @param {string} params.id - The ID of the global update.
 * @returns {Response} The global update object.
 */
export async function GET(request, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const globalUpdate = await GlobalUpdate.findById(id);
    if (!globalUpdate) {
      return NextResponse.json({ message: 'Global update not found' }, { status: 404 });
    }
    return NextResponse.json(globalUpdate, { status: 200 });
  } catch (error) {
    console.error(`Error fetching global update with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to fetch global update', error: error.message }, { status: 500 });
  }
}

/**
 * @route PUT /api/global-updates/:id
 * @description Update a global update by ID.
 * @param {Request} req - The incoming request object.
 * @param {Object} { params } - Object containing route parameters.
 * @param {string} params.id - The ID of the global update to update.
 * @returns {Response} The updated global update object.
 */
export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const body = await req.json();
    const updatedGlobalUpdate = await GlobalUpdate.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatedGlobalUpdate) {
      return NextResponse.json({ message: 'Global update not found' }, { status: 404 });
    }
    return NextResponse.json(updatedGlobalUpdate, { status: 200 });
  } catch (error) {
    console.error(`Error updating global update with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to update global update', error: error.message }, { status: 400 });
  }
}

/**
 * @route DELETE /api/global-updates/:id
 * @description Delete a global update by ID.
 * @param {Object} request - The request object.
 * @param {Object} { params } - Object containing route parameters.
 * @param {string} params.id - The ID of the global update to delete.
 * @returns {Response} A success message.
 */
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const deletedGlobalUpdate = await GlobalUpdate.findByIdAndDelete(id);
    if (!deletedGlobalUpdate) {
      return NextResponse.json({ message: 'Global update not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Global update deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting global update with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to delete global update', error: error.message }, { status: 500 });
  }
}
