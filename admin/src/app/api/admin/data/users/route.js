// app/api/admin/data/users/route.js (for the Admin Project)
import adminDbConnect from '@/lib/adminDbConnect';
import UserProfile from '@/models/UserProfile'; // Import public website's UserProfile model
import { NextResponse } from 'next/server';
import { adminAuthMiddleware } from '@/lib/adminAuthMiddleware'; // Admin auth middleware
import bcrypt from 'bcryptjs'; // For hashing passwords if creating manually

// GET all public users (requires admin role: superadmin)
export const GET = adminAuthMiddleware(async (req) => {
  await adminDbConnect(); // Connect to the database where UserProfile resides
  try {
    // Exclude sensitive info: password and refreshTokens
    const users = await UserProfile.find({}).select('-password -refreshTokens');
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Admin API - Error fetching public users:", error);
    return NextResponse.json({ message: 'Failed to fetch public users', error: error.message }, { status: 500 });
  }
}, ['superadmin']);

// POST a new public user (requires admin role: superadmin)
export const POST = adminAuthMiddleware(async (req) => {
  await adminDbConnect();
  try {
    const body = await req.json();
    const { name, passoutYear, college, username, email, password, isGoogleLogin, googleId, profilePicture, isverified } = body;

    // Basic validation
    if (!name || !username || !email || !passoutYear || !college) {
      return NextResponse.json({ message: 'Name, username, email, passout year, and college are required.' }, { status: 400 });
    }

    // If it's a manual login, password is required
    if (!isGoogleLogin && !password) {
      return NextResponse.json({ message: 'Password is required for manual logins.' }, { status: 400 });
    }

    // Check if user with email or username already exists
    const existingUser = await UserProfile.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ message: 'User with this email already exists.' }, { status: 409 });
      }
      if (existingUser.username === username) {
        return NextResponse.json({ message: 'User with this username already exists.' }, { status: 409 });
      }
    }

    const newUserId = `user_${Date.now()}`; // Simple ID generation

    const newUserPayload = {
      userId: newUserId,
      name,
      passoutYear: parseInt(passoutYear),
      college,
      username,
      email,
      isGoogleLogin: isGoogleLogin || false, // Default to false if not provided
      profilePicture: profilePicture || null,
      isverified: isverified || false, // Use 'isverified', default to false
      lastlogindate: null, // Initialized to null
      lastloginip: null,   // Initialized to null
      sessionVersion: 0,   // Initialized to 0
      refreshTokens: [],   // Initialized to empty array
    };

    // Hash password only if it's a manual login and password is provided
    if (!isGoogleLogin && password) {
      newUserPayload.password = await bcrypt.hash(password, 10);
    } else if (isGoogleLogin) {
      // For Google logins, password is not required, but googleId is
      if (!googleId) {
        return NextResponse.json({ message: 'Google ID is required for Google logins.' }, { status: 400 });
      }
      newUserPayload.googleId = googleId;
      newUserPayload.isverified = true; // Google users are typically verified by default
    }

    const newUser = await UserProfile.create(newUserPayload);

    // Exclude sensitive information from the response
    const { password: _, refreshTokens: __, ...userWithoutSensitiveData } = newUser.toObject();

    return NextResponse.json(userWithoutSensitiveData, { status: 201 });
  } catch (error) {
    console.error("Admin API - Error creating public user:", error);
    return NextResponse.json({ message: 'Failed to create public user', error: error.message }, { status: 400 });
  }
}, ['superadmin']);
