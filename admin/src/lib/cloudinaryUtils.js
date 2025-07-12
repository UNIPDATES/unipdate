// lib/cloudinaryUtils.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Use HTTPS
});

/**
 * Uploads a file buffer to Cloudinary.
 * @param {Buffer} fileBuffer - The file data as a Node.js Buffer.
 * @param {string} folder - The folder name in Cloudinary to upload to (e.g., 'unipdates', 'internship-images').
 * @param {string} resourceType - The type of resource ('image', 'video', 'raw'). Default 'image'.
 * @param {string} mimeType - The actual MIME type of the file (e.g., 'image/jpeg', 'application/pdf').
 * @returns {Promise<Object>} Cloudinary upload result.
 */
export async function uploadToCloudinary(
  fileBuffer, 
  folder = 'unipdates', 
  resourceType = 'auto',  // Changed to 'auto' for automatic detection
  mimeType = ''
) {
  try {
    // Construct proper data URI
    const dataUri = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;

    const uploadOptions = {
      folder,
      resource_type: resourceType,
      // Additional options for better PDF handling
      ...(mimeType === 'application/pdf' && {
        format: 'pdf', // Explicit format for PDFs
        type: 'upload' // Standard upload type
      })
    };

    const result = await cloudinary.uploader.upload(dataUri, uploadOptions);
    
    // For debugging
    console.log('Upload result:', {
      public_id: result.public_id,
      url: result.secure_url,
      resource_type: result.resource_type,
      format: result.format,
      pages: result.pages // For PDFs
    });

    return result;
  } catch (error) {
    console.error('Cloudinary error:', error);
    throw new Error(`Upload failed: ${error.message}`);
  }
}

/**
 * Deletes an asset from Cloudinary by its public ID.
 * @param {string} publicId - The public ID of the asset to delete.
 * @param {string} resourceType - The type of resource ('image', 'video', 'raw'). Default 'image'.
 * @returns {Promise<Object>} Cloudinary deletion result.
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    console.log('Cloudinary deletion successful:', result);
    return result;
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw new Error(`Failed to delete file from Cloudinary: ${error.message}`);
  }
};