// app/api/admin/data/support/route.js (for the Admin Project)
import adminDbConnect from '@/lib/adminDbConnect';
import Support from '@/models/Support';
import UserProfile from '@/models/UserProfile';
import College from '@/models/College';
import { NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuthMiddleware';

// GET all support requests (superadmin can see all; uniadmin can see their college's)
export const GET = adminAuthMiddleware(async (req) => {
  await adminDbConnect();
  try {
    const adminUser = req.adminUser;
    let query = {};

    if (adminUser.role === 'uniadmin') {
      query.relatedWith = 'college';
      query.college = adminUser.college;
    }

    const supportTickets = await Support.find(query)
      .populate('userId', 'name username email')
      .populate('college', 'name code')
      .populate('assignedTo', 'name username') // Populate assigned admin
      .sort({ createdAt: -1 });

    return NextResponse.json(supportTickets, { status: 200 });
  } catch (error) {
    console.error("Admin API - Error fetching support tickets:", error);
    return NextResponse.json({ message: 'Failed to fetch support tickets', error: error.message }, { status: 500 });
  }
}, ['superadmin', 'uniadmin']);

// POST a new support request (this API is for admin to manually create, usually not the flow)
// Typically, this would be on the public website's backend.
export const POST = adminAuthMiddleware(async (req) => {
  await adminDbConnect();
  try {
    const body = await req.json();
    const { userId, subject, message, relatedWith, college } = body;

    if (!userId || !subject || !message || !relatedWith) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }
    if (relatedWith === 'college' && !college) {
      return NextResponse.json({ message: 'College is required for college-related support.' }, { status: 400 });
    }
    if (relatedWith === 'global' && college) {
      return NextResponse.json({ message: 'College cannot be specified for global support.' }, { status: 400 });
    }

    // Validate userId and college existence
    const userExists = await UserProfile.findById(userId);
    if (!userExists) {
        return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }
    if (college) {
        const collegeExists = await College.findById(college);
        if (!collegeExists) {
            return NextResponse.json({ message: 'College not found.' }, { status: 404 });
        }
    }

    const newSupportTicket = await Support.create(body);
    return NextResponse.json(newSupportTicket, { status: 201 });
  } catch (error) {
    console.error("Admin API - Error creating support ticket:", error);
    return NextResponse.json({ message: 'Failed to create support ticket', error: error.message }, { status: 400 });
  }
}, ['superadmin']); // Only superadmin can manually create support tickets
