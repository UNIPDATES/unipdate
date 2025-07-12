// app/api/admin/data/contacts/route.js (for the Admin Project)
import adminDbConnect from '@/lib/adminDbConnect';
import Contact from '@/models/Contact';
import UserProfile from '@/models/UserProfile'; // To populate user info
import College from '@/models/College'; // To populate college info
import { NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuthMiddleware';

// GET all contact requests (superadmin can see all; uniadmin can see their college's)
export const GET = adminAuthMiddleware(async (req) => {
  await adminDbConnect();
  try {
    const adminUser = req.adminUser;
    let query = {};

    if (adminUser.role === 'uniadmin') {
      query.relatedWith = 'college';
      query.college = adminUser.college;
    }

    const contacts = await Contact.find(query)
      .populate('userId', 'name username email') // Populate user details
      .populate('college', 'name code') // Populate college details
      .sort({ createdAt: -1 }); // Sort by newest first

    return NextResponse.json(contacts, { status: 200 });
  } catch (error) {
    console.error("Admin API - Error fetching contacts:", error);
    return NextResponse.json({ message: 'Failed to fetch contacts', error: error.message }, { status: 500 });
  }
}, ['superadmin', 'uniadmin']);

// POST a new contact request (this API is for admin to manually create, usually not the flow)
// Typically, this would be on the public website's backend, but included for completeness if needed.
export const POST = adminAuthMiddleware(async (req) => {
  await adminDbConnect();
  try {
    const body = await req.json();
    const { userId, message, relatedWith, college } = body;

    if (!userId || !message || !relatedWith) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }
    if (relatedWith === 'college' && !college) {
      return NextResponse.json({ message: 'College is required for college-related contacts.' }, { status: 400 });
    }
    if (relatedWith === 'global' && college) {
      return NextResponse.json({ message: 'College cannot be specified for global contacts.' }, { status: 400 });
    }

    // Validate userId and college existence if necessary (optional, but good practice)
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

    const newContact = await Contact.create(body);
    return NextResponse.json(newContact, { status: 201 });
  } catch (error) {
    console.error("Admin API - Error creating contact:", error);
    return NextResponse.json({ message: 'Failed to create contact', error: error.message }, { status: 400 });
  }
}, ['superadmin']); // Only superadmin can manually create contacts