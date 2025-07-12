// app/api/admin/data/colleges/[id]/route.js
import adminDbConnect from '@/lib/adminDbConnect';
import College from '@/models/College';
import AdminUser from '@/models/AdminUser'; // Import AdminUser model
import UniUpdate from '@/models/UniUpdate'; // Import UniUpdate model
import UniContact from '@/models/Contact';   // Import Contact model (your schema named it Contact)
import UniSupport from '@/models/Support';   // Import Support model (your schema named it Support)
import UserProfile from '@/models/UserProfile'; // Import UserProfile model
import { NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuthMiddleware';
// No mongoose import for session needed as transactions are not used

// GET operation for a single college (requires superadmin)
export const GET = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const college = await College.findById(id);
    if (!college) {
      return NextResponse.json({ message: 'College not found' }, { status: 404 });
    }
    return NextResponse.json(college, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error fetching college with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to fetch college', error: error.message }, { status: 500 });
  }
}, ['superadmin']);

// PUT operation for a single college (requires superadmin)
export const PUT = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;
  try {
    const body = await req.json();
    const updatedCollege = await College.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatedCollege) {
      return NextResponse.json({ message: 'College not found' }, { status: 404 });
    }
    return NextResponse.json(updatedCollege, { status: 200 });
  } catch (error) {
    console.error(`Admin API - Error updating college with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to update college', error: error.message }, { status: 400 });
  }
}, ['superadmin']);

// DELETE operation for a single college with cascading delete (NO TRANSACTIONS)
export const DELETE = adminAuthMiddleware(async (req, { params }) => {
  await adminDbConnect();
  const { id } = params;

  try {
    // 1. Find the college to be deleted to get its name and _id
    const deletedCollege = await College.findById(id);
    if (!deletedCollege) {
      return NextResponse.json({ message: 'College not found' }, { status: 404 });
    }

    const collegeId = deletedCollege._id;
    const collegeName = deletedCollege.name;

    console.log(`Starting cascading delete for College: ${collegeName} (ID: ${collegeId})`);

    // 2. Delete associated AdminUsers (uniadmins)
    try {
      const adminDeleteResult = await AdminUser.deleteMany({ college: collegeId });
      console.log(`Deleted ${adminDeleteResult.deletedCount} uniadmins for college ${collegeName}`);
    } catch (err) {
      console.error(`Error deleting uniadmins for ${collegeName}:`, err);
      // Continue, as transactions are not used, but log the error
    }

    // 3. Delete associated UniUpdates (assuming uniId stores college ObjectId as string)
    try {
      const uniUpdateDeleteResult = await UniUpdate.deleteMany({ uniId: collegeId.toString() });
      console.log(`Deleted ${uniUpdateDeleteResult.deletedCount} uniupdates for college ${collegeName}`);
    } catch (err) {
      console.error(`Error deleting uniupdates for ${collegeName}:`, err);
    }

    // 4. Delete associated UniContacts
    try {
      const uniContactDeleteResult = await UniContact.deleteMany({ college: collegeId });
      console.log(`Deleted ${uniContactDeleteResult.deletedCount} unicontacts for college ${collegeName}`);
    } catch (err) {
      console.error(`Error deleting unicontacts for ${collegeName}:`, err);
    }

    // 5. Delete associated UniSupports
    try {
      const uniSupportDeleteResult = await UniSupport.deleteMany({ college: collegeId });
      console.log(`Deleted ${uniSupportDeleteResult.deletedCount} unisupport entries for college ${collegeName}`);
    } catch (err) {
      console.error(`Error deleting unisupport for ${collegeName}:`, err);
    }

    // 6. Update associated UserProfiles (set college to null, as college field is a String)
    try {
      const userProfileUpdateResult = await UserProfile.updateMany(
        { college: collegeName }, // Match by college name
        { $set: { college: null, passoutYear: null } } // Set to null
      );
      console.log(`Updated ${userProfileUpdateResult.modifiedCount} user profiles for college ${collegeName}`);
    } catch (err) {
      console.error(`Error updating user profiles for ${collegeName}:`, err);
    }

    // 7. Finally, delete the College document itself
    const finalCollegeDeleteResult = await College.deleteOne({ _id: collegeId });
    if (finalCollegeDeleteResult.deletedCount === 0) {
      // This case should ideally not happen if deletedCollege was found, but as a safeguard
      return NextResponse.json({ message: 'College not found or already deleted' }, { status: 404 });
    }
    console.log(`Successfully deleted college: ${collegeName}`);

    return NextResponse.json({ message: 'College and all associated data deleted successfully' }, { status: 200 });

  } catch (error) {
    console.error(`Admin API - Critical error during college deletion for ID ${id}:`, error);
    // This catch block will only be hit if finding the initial college fails,
    // or if the final College.deleteOne fails. Errors in intermediate deleteMany/updateMany
    // are caught by their internal try/catch blocks.
    return NextResponse.json({ message: 'Failed to delete college and associated data due to a critical error.', error: error.message }, { status: 500 });
  }
}, ['superadmin']);