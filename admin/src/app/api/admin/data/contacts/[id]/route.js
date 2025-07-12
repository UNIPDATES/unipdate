// app/api/admin/data/contacts/[id]/route.js (for the Admin Project)
import adminDbConnect from '@/lib/adminDbConnect';
import Contact from '@/models/Contact';
import UserProfile from '@/models/UserProfile';
import College from '@/models/College';
import { NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuthMiddleware';

// GET a single contact request (superadmin can see any; uniadmin can see their college's)
export const GET = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const adminUser = req.adminUser;
    const contact = await Contact.findById(id)
      .populate('userId', 'name username email')
      .populate('college', 'name code');

    if (!contact) {
      return NextResponse.json({ message: 'Contact request not found' }, { status: 404 });
    }

    // Uniadmin access control
    if (adminUser.role === 'uniadmin' && contact.relatedWith === 'college' && contact.college.toString() !== adminUser.college.toString()) {
      return NextResponse.json({ message: 'Forbidden: You can only access contacts for your assigned college.' }, { status: 403 });
    }
    if (adminUser.role === 'uniadmin' && contact.relatedWith === 'global') {
      return NextResponse.json({ message: 'Forbidden: You cannot access global contacts.' }, { status: 403 });
    }

    return NextResponse.json(contact, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error fetching contact with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to fetch contact', error: error.message }, { status: 500 });
  }
}, ['superadmin', 'uniadmin']);

// PUT (update) a contact request (superadmin can update any; uniadmin can update their college's)
export const PUT = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const adminUser = req.adminUser;
    const body = await req.json();
    const { status, resolvedBy, resolvedAt } = body; // Allow updating status and resolution info

    const contact = await Contact.findById(id);
    if (!contact) {
      return NextResponse.json({ message: 'Contact request not found' }, { status: 404 });
    }

    // Uniadmin access control
    if (adminUser.role === 'uniadmin') {
      if (contact.relatedWith === 'college' && contact.college.toString() !== adminUser.college.toString()) {
        return NextResponse.json({ message: 'Forbidden: You can only update contacts for your assigned college.' }, { status: 403 });
      }
      if (contact.relatedWith === 'global') {
        return NextResponse.json({ message: 'Forbidden: You cannot update global contacts.' }, { status: 403 });
      }
      // Uniadmin cannot change relatedWith or college fields
      if (body.relatedWith || body.college) {
        return NextResponse.json({ message: 'Forbidden: Uniadmin cannot change contact type or college.' }, { status: 403 });
      }
    }

    // Only allow specific fields to be updated
    const updates = {};
    if (status) updates.status = status;
    if (status === 'resolved') { // Automatically set resolvedBy and resolvedAt when status is set to resolved
      updates.resolvedBy = adminUser._id;
      updates.resolvedAt = new Date();
    } else if (status === 'pending' && contact.status === 'resolved') {
        // If changing back to pending, clear resolvedBy/At
        updates.resolvedBy = null;
        updates.resolvedAt = null;
    }


    const updatedContact = await Contact.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
      .populate('userId', 'name username email')
      .populate('college', 'name code');

    if (!updatedContact) {
      return NextResponse.json({ message: 'Contact request update failed' }, { status: 500 });
    }
    return NextResponse.json(updatedContact, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error updating contact with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to update contact', error: error.message }, { status: 400 });
  }
}, ['superadmin', 'uniadmin']);

// DELETE a contact request (superadmin only)
export const DELETE = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      return NextResponse.json({ message: 'Contact request not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Contact request deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error deleting contact with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to delete contact', error: error.message }, { status: 500 });
  }
}, ['superadmin']); // Only superadmin can delete contacts