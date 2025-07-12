// app/api/admin/data/upload-file/route.js (for the Admin Project)
import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinaryUtils'; // Your Cloudinary utility
import { adminAuthMiddleware } from '@/lib/adminAuthMiddleware'; // Your admin auth middleware

// IMPORTANT: For Next.js App Router, req.formData() automatically handles
// multipart/form-data and disables the default body parser.
// You generally do NOT need `export const config = { api: { bodyParser: false } };`
// in the App Router's route.js files for this to work.

export const POST = adminAuthMiddleware(async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file'); // 'file' should be the name of your file input field in the frontend form
    const folder = formData.get('folder') || 'admin-uploads'; // Optional: specify a subfolder in Cloudinary
    const resourceType = formData.get('resourceType') || 'image'; // Optional: 'image', 'video', 'raw'

    if (!file) {
      return NextResponse.json({ message: 'No file provided.' }, { status: 400 });
    }

    // Basic file type validation (optional, but recommended)
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const allowedPdfTypes = ['application/pdf'];

    if (resourceType === 'image' && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json({ message: 'Invalid image file type. Only JPEG, PNG, GIF, WEBP are allowed.' }, { status: 400 });
    }
    if (resourceType === 'raw' && !allowedPdfTypes.includes(file.type)) {
        // Example for raw type (e.g., PDFs)
        return NextResponse.json({ message: 'Invalid raw file type. Only PDF is allowed for raw uploads.' }, { status: 400 });
    }


    // Convert File object to Node.js Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudinary
    const result = await uploadToCloudinary(buffer, folder, resourceType);

    return NextResponse.json({
      message: 'File uploaded successfully.',
      imageUrl: result.secure_url,
      publicId: result.public_id, // Useful for later deletion
    }, { status: 200 });

  } catch (error) {
    console.error("Cloudinary Upload API error:", error);
    return NextResponse.json({ message: `Failed to upload file: ${error.message}` }, { status: 500 });
  }
}, ['superadmin', 'uniadmin']); // Allow both superadmin and uniadmin to upload files