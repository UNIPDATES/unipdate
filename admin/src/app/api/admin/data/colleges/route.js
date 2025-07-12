// app/api/admin/data/colleges/route.js
import adminDbConnect from '@/lib/adminDbConnect';
import College from '@/models/College'; // College model
import { NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuthMiddleware';

// GET all colleges (requires superadmin or uniadmin)
export const GET = adminAuthMiddleware(async (req) => {
  await adminDbConnect();
  try {
    const colleges = await College.find({});
    return NextResponse.json(colleges, { status: 200 });
  } catch (error) {
    console.error("Admin API - Error fetching colleges:", error);
    return NextResponse.json({ message: 'Failed to fetch colleges', error: error.message }, { status: 500 });
  }
}, ['superadmin', 'uniadmin']); // Uniadmins can view colleges

// POST a new college (requires superadmin only)
export const POST = adminAuthMiddleware(async (req) => {
  await adminDbConnect();
  try {
    const body = await req.json();
    const newCollege = await College.create(body);
    return NextResponse.json(newCollege, { status: 201 });
  } catch (error) {
    console.error("Admin API - Error creating college:", error);
    if (error.code === 11000) {
      return NextResponse.json({ message: 'College with this name or code already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to create college', error: error.message }, { status: 400 });
  }
}, ['superadmin']); // Only superadmin can create colleges