// app/api/admin/data/global-updates/[id]/route.js
import adminDbConnect from '@/lib/adminDbConnect';
import GlobalUpdate from '@/models/GlobalUpdate';
import { NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuthMiddleware';

// GET a single global update document by its MongoDB _id (requires superadmin)
export const GET = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const update = await GlobalUpdate.findById(id);
    if (!update) {
      return NextResponse.json({ message: 'Global update document not found' }, { status: 404 });
    }
    return NextResponse.json(update, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error fetching global update with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to fetch global update', error: error.message }, { status: 500 });
  }
}, ['superadmin']); // Permissions: Only superadmin

// PUT (update) a global update document by its MongoDB _id (requires superadmin)
export const PUT = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const body = await req.json();
    const updatedUpdate = await GlobalUpdate.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatedUpdate) {
      return NextResponse.json({ message: 'Global update document not found' }, { status: 404 });
    }
    return NextResponse.json(updatedUpdate, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error updating global update with ID ${id}:`, error);
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return NextResponse.json({ message: 'Validation Error', errors: messages }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to update global update', error: error.message }, { status: 400 });
  }
}, ['superadmin']); // Permissions: Only superadmin

// DELETE a global update document by its MongoDB _id (requires superadmin)
export const DELETE = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const deletedUpdate = await GlobalUpdate.findByIdAndDelete(id);
    if (!deletedUpdate) {
      return NextResponse.json({ message: 'Global update document not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Global update deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error deleting global update with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to delete global update', error: error.message }, { status: 500 });
  }
}, ['superadmin']); // Permissions: Only superadmin