const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create Cloudinary storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ikenga-political',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1200, height: 1200, crop: 'limit', quality: 'auto' }
    ]
  }
});

// Helper function to delete image from Cloudinary
const deleteImage = async (imageUrl) => {
  try {
    if (!imageUrl || imageUrl.includes('dummy') || imageUrl.includes('/images/')) {
      return; // Don't delete dummy images or local images
    }

    // Extract public_id from Cloudinary URL
    // Cloudinary URLs format: https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{folder}/{public_id}.{format}
    // or: https://res.cloudinary.com/{cloud_name}/image/upload/{folder}/{public_id}.{format}
    
    if (!imageUrl.includes('cloudinary.com')) {
      return; // Not a Cloudinary URL
    }

    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) return;
    
    // Get everything after 'upload'
    const afterUpload = urlParts.slice(uploadIndex + 1);
    if (afterUpload.length === 0) return;
    
    // Check if there's a version (starts with 'v')
    let publicIdParts = afterUpload;
    if (afterUpload[0] && afterUpload[0].startsWith('v')) {
      // Skip version number
      publicIdParts = afterUpload.slice(1);
    }
    
    if (publicIdParts.length === 0) return;
    
    // Get the filename and remove extension
    const filename = publicIdParts[publicIdParts.length - 1];
    const filenameWithoutExt = filename.split('.')[0];
    
    // Reconstruct public_id (folder + filename without extension)
    const folder = publicIdParts.slice(0, -1).join('/');
    const publicId = folder ? `${folder}/${filenameWithoutExt}` : filenameWithoutExt;
    
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    // Don't throw error, just log it
  }
};

// Helper function to delete multiple images
const deleteImages = async (imageUrls) => {
  if (!Array.isArray(imageUrls)) return;
  
  for (const url of imageUrls) {
    await deleteImage(url);
  }
};

module.exports = {
  cloudinary,
  storage,
  deleteImage,
  deleteImages
};

