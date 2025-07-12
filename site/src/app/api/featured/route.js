// app/api/featured/route.js
import dbConnect from '@/lib/dbConnect';
import Featured from '@/models/featured'; // Import the Featured model
import { NextResponse } from 'next/server';



export const GET = (async (req) => {
  await dbConnect();
  try {
    console.log("Admin API: Attempting to fetch all featured items...");
    // Fetch all items and sort by creation date (newest first)
    const featuredItems = await Featured.find({}).sort({ createdOn: -1 });

    console.log(`Admin API: Found ${featuredItems.length} featured items in the database.`);
    // Log details of each fetched item for debugging
    featuredItems.forEach(item => {
      console.log(`  - ID: ${item._id}, Tagline: "${item.tagLine}", Expiry: ${item.expiryDate.toISOString()}, Created: ${item.createdOn.toISOString()}`);
    });

    return NextResponse.json(featuredItems, { status: 200 });
  } catch (error) {
    console.error("Admin API - Error fetching featured items:", error);
    return NextResponse.json({ message: 'Failed to fetch featured items', error: error.message }, { status: 500 });
  }
}); 
