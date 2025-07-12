// app/api/users/[id]/route.js
import dbConnect from '@/lib/adminDbConnect';
import UserProfile from '@/models/UserProfile';
import { NextResponse } from 'next/server';

/**
 * @route GET /api/users/:id
 * @description Get a single user profile by ID.
 * @param {Object} request - The request object.
 * @param {Object} { params } - Object containing route parameters.
 * @param {string} params.id - The ID of the user profile.
 * @returns {Response} The user profile object.
 */
export async function GET(request, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const user = await UserProfile.findById(id);
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to fetch user', error: error.message }, { status: 500 });
  }
}

/**
 * @route PUT /api/users/:id
 * @description Update a user profile by ID.
 * @param {Request} req - The incoming request object containing updated user data.
 * @param {Object} { params } - Object containing route parameters.
 * @param {string} params.id - The ID of the user profile to update.
 * @returns {Response} The updated user profile object.
 */
export async function PUT(req, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const body = await req.json();
    const updatedUser = await UserProfile.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    if (error.code === 11000) {
      return NextResponse.json({ message: 'User with this email or username already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to update user', error: error.message }, { status: 400 });
  }
}

/**
 * @route DELETE /api/users/:id
 * @description Delete a user profile by ID.
 * @param {Object} request - The request object.
 * @param {Object} { params } - Object containing route parameters.
 * @param {string} params.id - The ID of the user profile to delete.
 * @returns {Response} A success message.
 */
export async function DELETE(request, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const deletedUser = await UserProfile.findByIdAndDelete(id);
    if (!deletedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    return NextResponse.json({ message: 'Failed to delete user', error: error.message }, { status: 500 });
  }
}
