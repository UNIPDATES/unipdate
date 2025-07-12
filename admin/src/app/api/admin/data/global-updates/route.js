// app/api/admin/data/global-updates/route.js
import adminDbConnect from '@/lib/adminDbConnect';
import GlobalUpdate from '@/models/GlobalUpdate';
import { NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuthMiddleware';

// GET all global updates (requires superadmin)
export const GET = adminAuthMiddleware(async (req) => {
  await adminDbConnect();
  try {
    // Sort by publishedAt in descending order (newest first)
    const updates = await GlobalUpdate.find({}).sort({ publishedAt: -1 });
    return NextResponse.json(updates, { status: 200 });
  } catch (error) {
    console.error("Admin API - Error fetching global updates:", error);
    return NextResponse.json({ message: 'Failed to fetch global updates', error: error.message }, { status: 500 });
  }
}, ['superadmin']); // Permissions: Only superadmin

// POST a new global update (requires superadmin)
export const POST = adminAuthMiddleware(async (req) => {
  await adminDbConnect();
  try {
    const body = await req.json();
    const newUpdate = await GlobalUpdate.create(body);
    return NextResponse.json(newUpdate, { status: 201 });
  } catch (error) {
    console.error("Admin API - Error creating global update:", error);
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return NextResponse.json({ message: 'Validation Error', errors: messages }, { status: 400 });
    }
    return NextResponse.json({ message: 'Failed to create global update', error: error.message }, { status: 400 });
  }
}, ['superadmin']); // Permissions: Only superadmin