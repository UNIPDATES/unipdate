// app/api/college/lookup/route.js
import dbConnect from '@/lib/dbConnect';
import College from '@/models/College'; // Use the updated College model
import { NextResponse } from 'next/server';

export async function GET(req) {
  await dbConnect(); // Connect to MongoDB

  const { searchParams } = new URL(req.url);
  const collegeName = searchParams.get('name');

  if (!collegeName) {
    return NextResponse.json({ success: false, message: 'College name is required as a query parameter.' }, { status: 400 });
  }

  try {
    // Find the college by its name (case-insensitive for robustness)
    const college = await College.findOne({ name: { $regex: new RegExp(`^${collegeName}$`, 'i') } });

    if (!college) {
      return NextResponse.json({ success: false, message: 'College not found with the provided name.' }, { status: 404 });
    }

    // Return the college's _id and name
    return NextResponse.json({ success: true, data: { _id: college._id, name: college.name } }, { status: 200 });
  } catch (error) {
    console.error('Error looking up college:', error);
    return NextResponse.json({ success: false, message: 'Failed to lookup college due to server error.', error: error.message }, { status: 500 });
  }
}