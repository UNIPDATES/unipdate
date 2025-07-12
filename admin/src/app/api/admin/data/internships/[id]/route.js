// app/api/admin/data/internships/[id]/route.js
import adminDbConnect from '@/lib/adminDbConnect';
import Internship from '@/models/Internship';
import { NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuthMiddleware';

// GET, PUT, DELETE operations for a single internship (requires superadmin)
export const GET = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const internship = await Internship.findById(id);
    if (!internship) {
      return NextResponse.json({ message: 'Internship not found' }, { status: 404 });
    }
    return NextResponse.json(internship, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error fetching internship with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to fetch internship', error: error.message }, { status: 500 });
  }
}, ['superadmin']);

export const PUT = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const body = await req.json();
    const updatedInternship = await Internship.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatedInternship) {
      return NextResponse.json({ message: 'Internship not found' }, { status: 404 });
    }
    return NextResponse.json(updatedInternship, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error updating internship with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to update internship', error: error.message }, { status: 400 });
  }
}, ['superadmin']);

export const DELETE = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const deletedInternship = await Internship.findByIdAndDelete(id);
    if (!deletedInternship) {
      return NextResponse.json({ message: 'Internship not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Internship deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error deleting internship with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to delete internship', error: error.message }, { status: 500 });
  }
}, ['superadmin']);