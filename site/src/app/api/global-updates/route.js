// app/api/global-updates/route.js
import dbConnect from '@/lib/dbConnect';
import GlobalUpdate from '@/models/GlobalUpdate';
import { NextResponse } from 'next/server';

/**
 * @route GET /api/global-updates
 * @description Get all global updates.
 * @returns {Response} A JSON array of global updates.
 */
export async function GET() {
  await dbConnect();
  try {
    const globalUpdates = await GlobalUpdate.find({}).sort({ publishedAt: -1 }); // Sort by newest first
    return NextResponse.json(globalUpdates, { status: 200 });
  } catch (error) {
    console.error("Error fetching global updates:", error);
    return NextResponse.json({ message: 'Failed to fetch global updates', error: error.message }, { status: 500 });
  }
}

/**
 * @route POST /api/global-updates
 * @description Create a new global update.
 * @param {Request} req - The incoming request object.
 * @returns {Response} The newly created global update.
 */
export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const newGlobalUpdate = await GlobalUpdate.create(body);
    return NextResponse.json(newGlobalUpdate, { status: 201 });
  } catch (error) {
    console.error("Error creating global update:", error);
    return NextResponse.json({ message: 'Failed to create global update', error: error.message }, { status: 400 });
  }
}
