// app/api/users/[id]/route.js
import dbConnect from '@/lib/dbConnect';
import UserProfile from '@/models/UserProfile';
import { NextResponse } from 'next/server';
import { verifyAccessToken } from '@/lib/jwtUtils';
import { uploadImageToCloudinary, deleteImageFromCloudinary } from '@/lib/cloudinary'; // Import Cloudinary utilities

// GET a single user by ID
export async function GET(req, { params }) {
  await dbConnect();
  try {
    const { id } = params;
    const user = await UserProfile.findById(id);

    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Exclude sensitive information and explicitly include college and passoutYear
    const userObject = user.toObject(); // Convert Mongoose document to plain JavaScript object
    const { password, refreshTokens, ...rest } = userObject;

    // Construct the response object, ensuring college and passoutYear are always present
    const userToSend = {
      ...rest, // This includes all other fields like userId, username, email, name, profilePicture, etc.
      college: userObject.college || null, // Explicitly include college, default to null if not present
      passoutYear: userObject.passoutYear || null // Explicitly include passoutYear, default to null if not present
    };

    return NextResponse.json(userToSend, { status: 200 });
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return NextResponse.json({ message: 'Failed to fetch user.', error: error.message }, { status: 500 });
  }
}

// PUT (update) a user profile by ID (including profile picture upload)
export async function PUT(req, { params }) {
  await dbConnect();
  try {
    const { id } = params;

    // 1. Authenticate user with Access Token
    const authHeader = req.headers.get('Authorization');
    const accessToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!accessToken) {
      return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
    }

    const decodedToken = verifyAccessToken(accessToken);

    if (!decodedToken || !decodedToken.userId) {
      return NextResponse.json({ message: 'Invalid or expired access token.' }, { status: 401 });
    }

    // Ensure the user is trying to update their own profile
    // if (decodedToken.userId !== id) {
    //   return NextResponse.json({ message: 'Unauthorized: You can only update your own profile.' }, { status: 403 });
    // }

    const user = await UserProfile.findById(id);
    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Check session version to ensure token is not revoked
    if (decodedToken.sessionVersion !== user.sessionVersion) {
      return NextResponse.json({ message: 'Session invalidated. Please log in again.' }, { status: 401 });
    }

    // 2. Determine content type and parse body accordingly
    const contentType = req.headers.get('content-type') || '';
    let updates = {};
    let updatedProfilePictureUrl = user.profilePicture; // Default to existing URL

    if (contentType.includes('multipart/form-data')) {
      // Handle file upload (e.g., profile picture)
      const formData = await req.formData();
      const profilePictureFile = formData.get('profilePicture');

      if (profilePictureFile instanceof File && profilePictureFile.size > 0) {
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        if (profilePictureFile.size > MAX_FILE_SIZE) {
          return NextResponse.json({ message: 'File size too large. Maximum 5MB allowed.' }, { status: 400 });
        }

        const arrayBuffer = await profilePictureFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const mimeType = profilePictureFile.type;

        if (user.profilePicture && user.profilePicture.includes('cloudinary.com')) {
          await deleteImageFromCloudinary(user.profilePicture);
        }

        updatedProfilePictureUrl = await uploadImageToCloudinary(buffer, mimeType, 'unipdates_profile_pictures');
      }

      // Extract other fields from formData if they are sent along with the file
      const name = formData.get('name');
      const username = formData.get('username');
      const passoutYear = formData.get('passoutYear');
      const college = formData.get('college'); // New field for college

      if (name) updates.name = name;
      if (username) updates.username = username;
      if (passoutYear) updates.passoutYear = parseInt(passoutYear);
      if (college) updates.college = college; // Update college if provided

    } else if (contentType.includes('application/json')) {
      // Handle JSON data updates (e.g., name, username, passoutYear without file)
      const body = await req.json();
      if (body.name) updates.name = body.name;
      if (body.username) updates.username = body.username;
      if (body.passoutYear) updates.passoutYear = parseInt(body.passoutYear);
      if (body.college) updates.college = body.college; // Update college if provided
      // Note: profilePicture updates via JSON would typically be a URL string,
      // but for file uploads, multipart/form-data is preferred.
      if (body.profilePicture) updates.profilePicture = body.profilePicture;

    } else {
      return NextResponse.json({ message: 'Unsupported Content-Type.' }, { status: 415 });
    }

    // Apply profile picture update (if it was part of the multipart form or explicitly set in JSON)
    updates.profilePicture = updatedProfilePictureUrl;

    // 3. Update user profile in database
    const updatedUser = await UserProfile.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!updatedUser) {
      return NextResponse.json({ message: 'User profile update failed.' }, { status: 500 });
    }

    // Exclude sensitive information from the response
    const { password: _, refreshTokens: __, ...userWithoutSensitiveData } = updatedUser.toObject();

    return NextResponse.json({ message: 'Profile updated successfully.', user: userWithoutSensitiveData }, { status: 200 });

  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json({ message: 'Failed to update profile.', error: error.message }, { status: 500 });
  }
}

// DELETE a user by ID (remains the same, but ensuring Cloudinary deletion)
export async function DELETE(req, { params }) {
  await dbConnect();
  try {
    const { id } = params;

    // Authenticate user with Access Token
    const authHeader = req.headers.get('Authorization');
    const accessToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

    if (!accessToken) {
      return NextResponse.json({ message: 'Authentication required.' }, { status: 401 });
    }

    const decodedToken = verifyAccessToken(accessToken);

    if (!decodedToken || !decodedToken.userId) {
      return NextResponse.json({ message: 'Invalid or expired access token.' }, { status: 401 });
    }

    // Ensure the user is trying to delete their own profile
    if (decodedToken.userId !== id) {
      return NextResponse.json({ message: 'Unauthorized: You can only delete your own profile.' }, { status: 403 });
    }

    const user = await UserProfile.findById(id);
    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Check session version
    if (decodedToken.sessionVersion !== user.sessionVersion) {
      return NextResponse.json({ message: 'Session invalidated. Please log in again.' }, { status: 401 });
    }

    // Delete profile picture from Cloudinary if it exists
    if (user.profilePicture && user.profilePicture.includes('cloudinary.com')) {
      await deleteImageFromCloudinary(user.profilePicture);
    }

    const deletedUser = await UserProfile.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: 'User deletion failed.' }, { status: 500 });
    }

    return NextResponse.json({ message: 'User deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ message: 'Failed to delete user.', error: error.message }, { status: 500 });
  }
}