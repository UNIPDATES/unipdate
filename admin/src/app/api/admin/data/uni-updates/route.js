// app/api/admin/data/uni-updates/route.js
import adminDbConnect from '@/lib/adminDbConnect';
import UniUpdate from '@/models/UniUpdate'; // Import public website's UniUpdate model
import { NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuthMiddleware';

// GET all university updates (superadmin or uniadmin for their college)
export const GET = adminAuthMiddleware(async (req) => {
  await adminDbConnect();
  try {
    const adminUser = req.adminUser;
    const { searchParams } = new URL(req.url);
    const requestedUniId = searchParams.get('uniId');

    let query = {};
    if (adminUser.role === 'uniadmin') {
      // Uniadmin can only see updates for their assigned college
      query.uniId = adminUser.college;
      if (requestedUniId && requestedUniId !== adminUser.college.toString()) {
        return NextResponse.json({ message: 'Forbidden: You can only view updates for your assigned college.' }, { status: 403 });
      }
    } else if (requestedUniId) {
      // Superadmin can filter by uniId
      query.uniId = requestedUniId;
    }

    const uniUpdates = await UniUpdate.find(query).sort({ publishedAt: -1 });
    return NextResponse.json(uniUpdates, { status: 200 });
  } catch (error) {
    console.error("Admin API - Error fetching university updates:", error);
    return NextResponse.json({ message: 'Failed to fetch university updates', error: error.message }, { status: 500 });
  }
}, ['superadmin', 'uniadmin']);

// POST a new university update (superadmin or uniadmin for their college)
export const POST = adminAuthMiddleware(async (req) => {
  await adminDbConnect();
  try {
    const adminUser = req.adminUser;
    const body = await req.json();

    if (adminUser.role === 'uniadmin') {
      // Uniadmin automatically assigns the update to their college
      body.uniId = adminUser.college;
    } else if (!body.uniId) {
      // Superadmin must explicitly provide uniId
      return NextResponse.json({ message: 'Superadmin must specify a uniId for the university update.' }, { status: 400 });
    }

    const newUniUpdate = await UniUpdate.create(body);
    return NextResponse.json(newUniUpdate, { status: 201 });
  } catch (error) {
    console.error("Admin API - Error creating university update:", error);
    return NextResponse.json({ message: 'Failed to create university update', error: error.message }, { status: 400 });
  }
}, ['superadmin', 'uniadmin']);