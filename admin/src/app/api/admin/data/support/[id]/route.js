// app/api/admin/data/support/[id]/route.js (for the Admin Project)
import adminDbConnect from '@/lib/adminDbConnect';
import Support from '@/models/Support';
import UserProfile from '@/models/UserProfile';
import College from '@/models/College';
import AdminUser from '@/models/AdminUser'; // For assigning support tickets
import { NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuthMiddleware';

// GET a single support request (superadmin can see any; uniadmin can see their college's)
export const GET = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const adminUser = req.adminUser;
    const supportTicket = await Support.findById(id)
      .populate('userId', 'name username email')
      .populate('college', 'name code')
      .populate('assignedTo', 'name username');

    if (!supportTicket) {
      return NextResponse.json({ message: 'Support ticket not found' }, { status: 404 });
    }

    // Uniadmin access control
    if (adminUser.role === 'uniadmin' && supportTicket.relatedWith === 'college' && supportTicket.college.toString() !== adminUser.college.toString()) {
      return NextResponse.json({ message: 'Forbidden: You can only access support tickets for your assigned college.' }, { status: 403 });
    }
    if (adminUser.role === 'uniadmin' && supportTicket.relatedWith === 'global') {
      return NextResponse.json({ message: 'Forbidden: You cannot access global support tickets.' }, { status: 403 });
    }

    return NextResponse.json(supportTicket, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error fetching support ticket with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to fetch support ticket', error: error.message }, { status: 500 });
  }
}, ['superadmin', 'uniadmin']);

// PUT (update) a support request (superadmin can update any; uniadmin can update their college's)
export const PUT = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const adminUser = req.adminUser;
    const body = await req.json();
    const { status, assignedTo, lastAdminReply, ...otherUpdates } = body;

    const supportTicket = await Support.findById(id);
    if (!supportTicket) {
      return NextResponse.json({ message: 'Support ticket not found' }, { status: 404 });
    }

    // Uniadmin access control
    if (adminUser.role === 'uniadmin') {
      if (supportTicket.relatedWith === 'college' && supportTicket.college.toString() !== adminUser.college.toString()) {
        return NextResponse.json({ message: 'Forbidden: You can only update support tickets for your assigned college.' }, { status: 403 });
      }
      if (supportTicket.relatedWith === 'global') {
        return NextResponse.json({ message: 'Forbidden: You cannot update global support tickets.' }, { status: 403 });
      }
      // Uniadmin cannot change relatedWith, college, or assignTo other admins (only assign to themselves)
      if (body.relatedWith || body.college || (assignedTo && assignedTo.toString() !== adminUser._id.toString())) {
        return NextResponse.json({ message: 'Forbidden: Uniadmin cannot change ticket type, college, or assign to other admins.' }, { status: 403 });
      }
      // If uniadmin is assigning to themselves, ensure it's their ID
      if (assignedTo && assignedTo.toString() === adminUser._id.toString()) {
        otherUpdates.assignedTo = assignedTo;
      } else if (assignedTo) { // If uniadmin tries to assign to someone else
        return NextResponse.json({ message: 'Forbidden: Uniadmin can only assign tickets to themselves.' }, { status: 403 });
      }
    } else if (adminUser.role === 'superadmin') {
      // Superadmin can assign to any valid admin
      if (assignedTo) {
        const assignedAdminExists = await AdminUser.findById(assignedTo);
        if (!assignedAdminExists) {
          return NextResponse.json({ message: 'Assigned admin user not found.' }, { status: 404 });
        }
        otherUpdates.assignedTo = assignedTo;
      }
    }


    // Update status and reply
    if (status) updates.status = status;
    if (lastAdminReply) {
      updates.lastAdminReply = lastAdminReply;
      updates.lastAdminReplyAt = new Date();
    }

    Object.assign(updates, otherUpdates); // Merge other updates

    const updatedSupportTicket = await Support.findByIdAndUpdate(id, updates, { new: true, runValidators: true })
      .populate('userId', 'name username email')
      .populate('college', 'name code')
      .populate('assignedTo', 'name username');

    if (!updatedSupportTicket) {
      return NextResponse.json({ message: 'Support ticket update failed' }, { status: 500 });
    }
    return NextResponse.json(updatedSupportTicket, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error updating support ticket with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to update support ticket', error: error.message }, { status: 400 });
  }
}, ['superadmin', 'uniadmin']);

// DELETE a support request (superadmin only)
export const DELETE = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const deletedSupportTicket = await Support.findByIdAndDelete(id);
    if (!deletedSupportTicket) {
      return NextResponse.json({ message: 'Support ticket not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Support ticket deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error deleting support ticket with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to delete support ticket', error: error.message }, { status: 500 });
  }
}, ['superadmin']); // Only superadmin can delete support tickets