# Cloudinary Setup Guide

This project now uses Cloudinary for image storage instead of local file storage. All uploaded images are stored in the cloud and URLs are saved to the database.

## Setup Steps

### 1. Create a Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account (or log in if you already have one)
3. The free tier includes:
   - 25 GB storage
   - 25 GB monthly bandwidth
   - Image transformations

### 2. Get Your Cloudinary Credentials

1. After logging in, go to your Dashboard
2. You'll see your account details:
   - **Cloud Name** (e.g., `your-cloud-name`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

### 3. Configure Environment Variables

Add these to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

**Important**: Never commit your `.env` file to version control!

### 4. Install Dependencies

The required packages are already in `package.json`. Just run:

```bash
npm install
```

This will install:
- `cloudinary` - Cloudinary SDK
- `multer-storage-cloudinary` - Multer storage adapter for Cloudinary

## How It Works

### Image Upload Flow

1. User uploads an image through the admin panel or public form
2. Multer receives the file and passes it to Cloudinary storage
3. Cloudinary processes and stores the image
4. Cloudinary returns a URL (e.g., `https://res.cloudinary.com/your-cloud/image/upload/v1234567890/ikenga-political/image-name.jpg`)
5. The URL is saved to the MongoDB database

### Image Deletion

When an image is deleted:
1. The system extracts the `public_id` from the Cloudinary URL
2. Calls Cloudinary's delete API to remove the image
3. Updates the database record

### Image Organization

All images are stored in the `ikenga-political` folder on Cloudinary, organized by:
- Profile images
- Achievement images
- Philanthropic activity images
- Goodwill message images

## Benefits

✅ **Scalability**: No server storage limits  
✅ **Performance**: Cloudinary CDN for fast image delivery  
✅ **Transformations**: Automatic image optimization  
✅ **Reliability**: Cloud-based storage with backups  
✅ **Bandwidth**: Reduced server bandwidth usage  

## Image Transformations

Images are automatically optimized:
- Maximum dimensions: 1200x1200px
- Quality: Auto-optimized
- Format: Original format preserved (JPG, PNG, GIF, WebP)

You can customize transformations in `config/cloudinary.js`.

## Troubleshooting

### Images Not Uploading

1. Check your Cloudinary credentials in `.env`
2. Verify your Cloudinary account is active
3. Check file size limits (default: 5MB)
4. Check file format (allowed: jpg, jpeg, png, gif, webp)

### Images Not Deleting

- The delete function only works for Cloudinary URLs
- Local/dummy images are skipped automatically
- Check Cloudinary dashboard to verify deletion

### URL Format Issues

If you see URL format errors:
- Ensure images were uploaded through the new system
- Old local images will still work (they're not migrated automatically)
- New uploads will use Cloudinary URLs

## Migration from Local Storage

If you have existing images in `public/uploads/`:

1. They will continue to work (the system checks for local vs Cloudinary URLs)
2. To migrate:
   - Download images from your server
   - Re-upload them through the admin panel
   - They will be automatically stored in Cloudinary

## Security Notes

- Keep your API Secret secure
- Use environment variables (never hardcode credentials)
- Consider using Cloudinary's upload presets for additional security
- Set up Cloudinary security settings (allowed URLs, etc.)

## Cost Considerations

- Free tier: 25 GB storage, 25 GB bandwidth/month
- Monitor usage in Cloudinary dashboard
- Upgrade plan if needed for production

For more information, visit [Cloudinary Documentation](https://cloudinary.com/documentation)

