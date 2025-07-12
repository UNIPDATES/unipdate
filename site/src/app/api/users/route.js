// app/api/users/route.js
import dbConnect from '@/lib/dbConnect';
import UserProfile from '@/models/UserProfile'; // Assuming UserProfile.js is in models/
import { NextResponse } from 'next/server';

/**
 * @route GET /api/users
 * @description Get all user profiles. (Admin access or restricted)
 * @returns {Response} A JSON array of user profiles.
 */
export async function GET() {
  await dbConnect();
  try {
    const users = await UserProfile.find({});
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ message: 'Failed to fetch users', error: error.message }, { status: 500 });
  }
}

/**
 * @route POST /api/users
 * @description Create a new user profile (for manual signup).
 * @param {Request} req - The incoming request object containing user data.
 * @returns {Response} The newly created user profile.
 */
export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    // In a real app, you'd hash the password here before saving
    const newUser = await UserProfile.create(body);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    // Handle duplicate key error (e.g., duplicate username/email)
    if (error.code === 11000) {
      return NextResponse.json({ message: 'User with this email or username already exists.' }, { status: 409 });
    }
    return NextResponse.json({ message: 'Failed to create user', error: error.message }, { status: 400 });
  }
}
