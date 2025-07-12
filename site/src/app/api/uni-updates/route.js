// app/api/uni-updates/route.js
import dbConnect from '@/lib/dbConnect';
import UniUpdate from '@/models/UniUpdate';
import { NextResponse } from 'next/server';

/**
 * @route GET /api/uni-updates
 * @description Get all university-specific updates. Can be filtered by uniId.
 * @param {Request} req - The incoming request object (for query params).
 * @returns {Response} A JSON array of university updates.
 */
export async function GET(req) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const uniId = searchParams.get('uniId'); // Get uniId from query parameter

    let query = {};
    if (uniId) {
      query.uniId = uniId; // Filter by uniId if provided
    }

    const uniUpdates = await UniUpdate.find(query).sort({ publishedAt: -1 });
    return NextResponse.json(uniUpdates, { status: 200 });
  } catch (error) {
    console.error("Error fetching university updates:", error);
    return NextResponse.json({ message: 'Failed to fetch university updates', error: error.message }, { status: 500 });
  }
}

/**
 * @route POST /api/uni-updates
 * @description Create a new university-specific update.
 * @param {Request} req - The incoming request object.
 * @returns {Response} The newly created university update.
 */
export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const newUniUpdate = await UniUpdate.create(body);
    return NextResponse.json(newUniUpdate, { status: 201 });
  } catch (error) {
    console.error("Error creating university update:", error);
    return NextResponse.json({ message: 'Failed to create university update', error: error.message }, { status: 400 });
  }
}

