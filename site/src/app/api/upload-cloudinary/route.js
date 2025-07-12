// app/api/upload-image/route.js
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import formidable from 'formidable';
import fs from 'fs'; // Node.js file system module

// Configure Cloudinary using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Use HTTPS
});

// Important: Disable Next.js Body Parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

/**
 * @route POST /api/upload-image
 * @description Handles image and PDF uploads to Cloudinary.
 * @param {Request} req - The incoming request object containing the file.
 * @returns {Response} A JSON object with the Cloudinary secure_url.
 */
export async function POST(req) {
  return new Promise((resolve, reject) => {
    const form = formidable({}); // Initialize formidable

    // Parse the incoming request for files and fields
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form data:", err);
        return resolve(NextResponse.json({ message: 'Error parsing form data', error: err.message }, { status: 500 }));
      }

      // Check if a file was actually uploaded
      const file = files.file ? files.file[0] : null; // formidable 3.x returns arrays for files
      if (!file) {
        return resolve(NextResponse.json({ message: 'No file uploaded' }, { status: 400 }));
      }

      // Determine resource type based on file extension or MIME type
      let resourceType = 'auto'; // Default to auto-detection
      const fileExtension = file.originalFilename.split('.').pop().toLowerCase();

      if (['pdf'].includes(fileExtension)) {
        resourceType = 'raw'; // Explicitly set to 'raw' for PDFs
      } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
        resourceType = 'image'; // Explicitly set to 'image' for common image types
      }
      // For other types, 'auto' will let Cloudinary decide.

      try {
        // Upload the file to Cloudinary
        // file.filepath contains the temporary path where formidable saved the file
        const result = await cloudinary.uploader.upload(file.filepath, {
          folder: resourceType === 'raw' ? 'uniupdates_notes_pdfs' : 'uniupdates_notes_images', // Separate folders for organization
          resource_type: resourceType,
          // Optional: You can add public_id here if you want to control the filename in Cloudinary
          // public_id: `notes_${Date.now()}_${file.originalFilename.replace(/\s/g, '_')}`,
        });

        // Clean up the temporary file created by formidable
        fs.unlink(file.filepath, (unlinkErr) => {
          if (unlinkErr) console.error("Error deleting temp file:", unlinkErr);
        });

        // Return the secure URL from Cloudinary
        return resolve(NextResponse.json({ secure_url: result.secure_url }, { status: 200 }));

      } catch (cloudinaryError) {
        console.error("Error uploading to Cloudinary:", cloudinaryError);
        return resolve(NextResponse.json({ message: 'Failed to upload file to Cloudinary', error: cloudinaryError.message }, { status: 500 }));
      }
    });
  });
}
