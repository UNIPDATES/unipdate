// app/api/admin/data/featured/[id]/route.js
import adminDbConnect from '@/lib/adminDbConnect';
import Featured from '@/models/featured';
import { NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuthMiddleware';

// GET a single featured item by ID (requires superadmin)
export const GET = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const featuredItem = await Featured.findById(id);
    if (!featuredItem) {
      return NextResponse.json({ message: 'Featured item not found.' }, { status: 404 });
    }
    return NextResponse.json(featuredItem, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error fetching featured item with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to fetch featured item.', error: error.message }, { status: 500 });
  }
}, ['superadmin']);

// PUT (update) a featured item by ID (requires superadmin)
export const PUT = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    // Expect JSON body with img URL, tagLine, and expiryDate
    const { img, tagLine, expiryDate } = await req.json();

    const updates = {};

    // Update img URL if provided (can be empty string if removed)
    if (typeof img !== 'undefined') {
      updates.img = img;
    }

    // Update tagline if provided
    if (tagLine) {
      updates.tagLine = tagLine;
    }

    // Update expiryDate if provided
    if (expiryDate) {
      updates.expiryDate = new Date(expiryDate);
    }

    const updatedFeatured = await Featured.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!updatedFeatured) {
      return NextResponse.json({ message: 'Featured item not found or update failed.' }, { status: 404 });
    }
    return NextResponse.json(updatedFeatured, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error updating featured item with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to update featured item.', error: error.message }, { status: 400 });
  }
}, ['superadmin']);

// DELETE a featured item by ID (requires superadmin)
export const DELETE = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const deletedFeatured = await Featured.findByIdAndDelete(id);
    if (!deletedFeatured) {
      return NextResponse.json({ message: 'Featured item not found.' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Featured item deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error deleting featured item with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to delete featured item.', error: error.message }, { status: 500 });
  }
}, ['superadmin']);
