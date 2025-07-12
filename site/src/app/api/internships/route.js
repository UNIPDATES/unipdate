// app/api/internships/route.js
import dbConnect from '@/lib/dbConnect';
import Internship from '@/models/Internship';
import { NextResponse } from 'next/server';

/**
 * @route GET /api/internships
 * @description Get all internship listings.
 * @returns {Response} A JSON array of internships.
 */
export async function GET() {
  await dbConnect();
  try {
    const internships = await Internship.find({}).sort({ postedAt: -1 });
    return NextResponse.json(internships, { status: 200 });
  } catch (error) {
    console.error("Error fetching internships:", error);
    return NextResponse.json({ message: 'Failed to fetch internships', error: error.message }, { status: 500 });
  }
}

/**
 * @route POST /api/internships
 * @description Create a new internship listing.
 * @param {Request} req - The incoming request object.
 * @returns {Response} The newly created internship.
 */
export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const newInternship = await Internship.create(body);
    return NextResponse.json(newInternship, { status: 201 });
  } catch (error) {
    console.error("Error creating internship:", error);
    return NextResponse.json({ message: 'Failed to create internship', error: error.message }, { status: 400 });
  }
}
