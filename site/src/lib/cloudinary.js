// lib/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

// Ensure these are set in your .env.local
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  throw new Error('Cloudinary environment variables are not fully defined.');
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

/**
 * Uploads file data (Buffer) to Cloudinary after converting it to a Data URI.
 * @param {Buffer} fileBuffer - The file data as a Node.js Buffer.
 * @param {string} mimeType - The MIME type of the file (e.g., 'image/jpeg', 'image/png').
 * @param {string} folder - The folder in Cloudinary to upload to (e.g., 'profile_pictures').
 * @returns {Promise<string>} The URL of the uploaded image.
 */
export const uploadImageToCloudinary = async (fileBuffer, mimeType, folder = 'unipdates_uploads') => {
  try {
    const dataUri = `data:${mimeType};base64,${fileBuffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder,
      quality: 'auto:low',
      fetch_format: 'auto',
    });

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    const safeMessage = error?.message || JSON.stringify(error);
    throw new Error(`Failed to upload image to Cloudinary: ${safeMessage}`);
  }
};


/**
 * Deletes an image from Cloudinary using its public ID.
 * @param {string} imageUrl - The full URL of the image to delete.
 * @returns {Promise<object>} The Cloudinary deletion result.
 */
export const deleteImageFromCloudinary = async (imageUrl) => {
  try {
    // Extract public ID from the Cloudinary URL
    const publicIdMatch = imageUrl.match(/\/v\d+\/(.+?)\./);
    if (!publicIdMatch || !publicIdMatch[1]) {
      console.warn("Could not extract public ID from Cloudinary URL:", imageUrl);
      return { result: 'not found', message: 'Invalid Cloudinary URL or public ID not found.' };
    }
    const publicId = publicIdMatch[1];
    
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Cloudinary deletion error:", error);
    throw new Error(`Failed to delete image from Cloudinary: ${error.message}`);
  }
};
