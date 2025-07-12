// app/api/admin/upload-pdf/route.js
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (req) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file');
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Verify file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const base64Data = Buffer.from(buffer).toString('base64');
    const dataUri = `data:${file.type};base64,${base64Data}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      resource_type: 'auto', // Let Cloudinary detect the type
      folder: 'pdf-notes',
      format: 'pdf',
      allowed_formats: ['pdf'],
      type: 'upload',
    });

    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
      pages: result.pages // For multi-page PDFs
    });

  } catch (error) {
    console.error('PDF upload error:', error);
    return NextResponse.json(
      { error: 'PDF upload failed', details: error.message },
      { status: 500 }
    );
  }
};