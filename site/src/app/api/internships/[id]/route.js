// app/api/internships/[id]/route.js
import dbConnect from '@/lib/dbConnect';
import Internship from '@/models/Internship';
import { NextResponse } from 'next/server';

/**
 * @route GET /api/internships/:id
 * @description Get a single internship listing by ID.
 * @param {Object} request - The request object.
 * @param {Object} { params } - Object containing route parameters.
 * @param {string} params.id - The ID of the internship.
 * @returns {Response} The internship object.
 */
export async function GET(request, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const internship = await Internship.findById(id);
    if (!internship) {
      return NextResponse.json({ message: 'Internship not found' }, { status: 404 });
    }
    return NextResponse.json(internship, { status: 200 });
  } catch (error) {
    console.error(`Error fetching internship with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to fetch internship', error: error.message }, { status: 500 });
  }
}

/**
 * @route PUT /api/internships/:id
 * @description Update an internship listing by ID.
 * @param {Request} req - The incoming request object.
 * @param {Object} { params } - Object containing route parameters.
 * @param {string} params.id - The ID of the internship to update.
 * @returns {Response} The updated internship object.
 */
export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const body = await req.json();
    const updatedInternship = await Internship.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatedInternship) {
      return NextResponse.json({ message: 'Internship not found' }, { status: 404 });
    }
    return NextResponse.json(updatedInternship, { status: 200 });
  } catch (error) {
    console.error(`Error updating internship with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to update internship', error: error.message }, { status: 400 });
  }
}

/**
 * @route DELETE /api/internships/:id
 * @description Delete an internship listing by ID.
 * @param {Object} request - The request object.
 * @param {Object} { params } - Object containing route parameters.
 * @param {string} params.id - The ID of the internship to delete.
 * @returns {Response} A success message.
 */
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const deletedInternship = await Internship.findByIdAndDelete(id);
    if (!deletedInternship) {
      return NextResponse.json({ message: 'Internship not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Internship deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting internship with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to delete internship', error: error.message }, { status: 500 });
  }
}
