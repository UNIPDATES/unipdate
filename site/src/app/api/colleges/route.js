// app/api/colleges/route.js
import dbConnect from '@/lib/dbConnect';
import College from '@/models/College'; // College model
import { NextResponse } from 'next/server';

// GET all colleges 
export const GET =(async (req) => {
  await dbConnect();
  try {
    const colleges = await College.find({});
    return NextResponse.json(colleges, { status: 200 });
  } catch (error) {
    console.error("Error fetching colleges:", error);
    return NextResponse.json({ message: 'Failed to fetch colleges', error: error.message }, { status: 500 });
  }
}); 

