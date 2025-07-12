// app/api/admin/data/internships/route.js
import adminDbConnect from '@/lib/adminDbConnect';
import Internship from '@/models/Internship'; // Import public website's Internship model
import { NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuthMiddleware';

// GET all internships (requires superadmin)
export const GET = adminAuthMiddleware(async (req) => {
  await adminDbConnect();
  try {
    const internships = await Internship.find({}).sort({ postedAt: -1 });
    return NextResponse.json(internships, { status: 200 });
  } catch (error) {
    console.error("Admin API - Error fetching internships:", error);
    return NextResponse.json({ message: 'Failed to fetch internships', error: error.message }, { status: 500 });
  }
}, ['superadmin']);

// POST a new internship (requires superadmin)
export const POST = adminAuthMiddleware(async (req) => {
  await adminDbConnect();
  try {
    const body = await req.json();
    const newInternship = await Internship.create(body);
    return NextResponse.json(newInternship, { status: 201 });
  } catch (error) {
    console.error("Admin API - Error creating internship:", error);
    return NextResponse.json({ message: 'Failed to create internship', error: error.message }, { status: 400 });
  }
}, ['superadmin']);