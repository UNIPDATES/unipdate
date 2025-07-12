// app/api/admin/data/uni-updates/[id]/route.js
import adminDbConnect from '@/lib/adminDbConnect';
import UniUpdate from '@/models/UniUpdate';
import { NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuthMiddleware';

// GET, PUT, DELETE operations for a single university update
export const GET = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const adminUser = req.adminUser;
    const uniUpdate = await UniUpdate.findById(id);

    if (!uniUpdate) {
      return NextResponse.json({ message: 'University update not found' }, { status: 404 });
    }

    // Uniadmin access check
    if (adminUser.role === 'uniadmin' && uniUpdate.uniId.toString() !== adminUser.college.toString()) {
      return NextResponse.json({ message: 'Forbidden: You can only access updates for your assigned college.' }, { status: 403 });
    }

    return NextResponse.json(uniUpdate, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error fetching university update with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to fetch university update', error: error.message }, { status: 500 });
  }
}, ['superadmin', 'uniadmin']);

export const PUT = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const adminUser = req.adminUser;
    const body = await req.json();

    const uniUpdate = await UniUpdate.findById(id);
    if (!uniUpdate) {
      return NextResponse.json({ message: 'University update not found' }, { status: 404 });
    }

    // Uniadmin access and modification check
    if (adminUser.role === 'uniadmin') {
      if (uniUpdate.uniId.toString() !== adminUser.college.toString()) {
        return NextResponse.json({ message: 'Forbidden: You can only update updates for your assigned college.' }, { status: 403 });
      }
      // Prevent uniadmin from changing uniId
      if (body.uniId && body.uniId.toString() !== uniUpdate.uniId.toString()) {
        return NextResponse.json({ message: 'Forbidden: Uniadmin cannot change the associated college of an update.' }, { status: 403 });
      }
    }

    const updatedUniUpdate = await UniUpdate.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatedUniUpdate) {
      return NextResponse.json({ message: 'University update not found' }, { status: 404 });
    }
    return NextResponse.json(updatedUniUpdate, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error updating university update with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to update university update', error: error.message }, { status: 400 });
  }
}, ['superadmin', 'uniadmin']);

export const DELETE = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const adminUser = req.adminUser;
    const uniUpdate = await UniUpdate.findById(id);

    if (!uniUpdate) {
      return NextResponse.json({ message: 'University update not found' }, { status: 404 });
    }

    // Uniadmin access check
    if (adminUser.role === 'uniadmin' && uniUpdate.uniId.toString() !== adminUser.college.toString()) {
      return NextResponse.json({ message: 'Forbidden: You can only delete updates for your assigned college.' }, { status: 403 });
    }

    const deletedUniUpdate = await UniUpdate.findByIdAndDelete(id);
    if (!deletedUniUpdate) {
      return NextResponse.json({ message: 'University update not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'University update deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error deleting university update with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to delete university update', error: error.message }, { status: 500 });
  }
}, ['superadmin', 'uniadmin']);