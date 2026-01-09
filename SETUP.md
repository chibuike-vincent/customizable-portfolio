# Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ikenga_political
SESSION_SECRET=your-super-secret-key-change-this
NODE_ENV=development
```

### 3. Start MongoDB
Make sure MongoDB is running on your system. If using local MongoDB:
```bash
# macOS (using Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
# Start MongoDB service from Services
```

### 4. Create Admin User
Run the setup script:
```bash
node scripts/createAdmin.js
```

This will create an admin user with:
- Username: `admin`
- Password: `admin123`

**⚠️ IMPORTANT: Change the password immediately after first login!**

### 5. Add Dummy Images (Optional)
Place placeholder images in `public/images/`:
- `dummy-profile.jpg` - For profile images
- `dummy-achievement.jpg` - For achievement images
- `dummy-philanthropic.jpg` - For philanthropic activity images
- `dummy-message.jpg` - For goodwill message images

You can use any placeholder image service or create your own. Recommended size: 800x600px or larger.

### 6. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

### 7. Access the Application
- **Public Site**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login

## First Steps After Setup

1. **Login to Admin Panel**
   - Go to http://localhost:3000/admin/login
   - Use credentials: `admin` / `admin123`
   - Change password immediately

2. **Update Profile**
   - Go to Admin → Profile
   - Fill in name, title, biography
   - Upload profile image
   - Add social media links

3. **Configure Settings**
   - Go to Admin → Settings
   - Set site title and description
   - Add contact email

4. **Add Content**
   - Add achievements
   - Add philanthropic activities
   - Verify goodwill messages

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check `MONGODB_URI` in `.env`
- Verify MongoDB port (default: 27017)

### Port Already in Use
- Change `PORT` in `.env`
- Or kill the process using the port

### Admin Login Not Working
- Run `node scripts/createAdmin.js` again
- Check MongoDB connection
- Verify admin user exists in database

### Images Not Displaying
- Check `public/uploads/` directory exists
- Verify file permissions
- Check image paths in database

## Production Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a production MongoDB instance (MongoDB Atlas recommended)
3. Set a strong `SESSION_SECRET`
4. Configure proper file storage (consider cloud storage for uploads)
5. Use a process manager (PM2 recommended)
6. Set up reverse proxy (nginx)
7. Enable HTTPS
8. Set up regular backups

## Security Checklist

- [ ] Change default admin password
- [ ] Use strong `SESSION_SECRET`
- [ ] Enable HTTPS in production
- [ ] Configure CORS if needed
- [ ] Set up file upload limits
- [ ] Regular database backups
- [ ] Keep dependencies updated
- [ ] Monitor for security vulnerabilities

