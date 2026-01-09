# Ikenga Political Website

A stunning political website built with Node.js, Express, EJS, and MongoDB. Features a comprehensive CMS backend for managing content.

## Features

- **Story-driven UI**: Engaging narrative presentation
- **Timeline-based Achievements**: Chronological display of accomplishments
- **Verified Goodwill Messages**: Community messages with verification system
- **Motion-first Design**: Smooth animations and transitions
- **Real-time Content Updates**: Immediate reflection of admin changes
- **Admin-friendly CMS**: Intuitive content management system

## Tech Stack

- **Backend**: Node.js, Express.js
- **Template Engine**: EJS
- **Database**: MongoDB with Mongoose
- **Authentication**: Session-based with bcrypt
- **File Upload**: Cloudinary (via Multer)
- **Styling**: Custom CSS with animations

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Ikenga-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `PORT`: Server port (default: 3000)
   - `MONGODB_URI`: MongoDB connection string
   - `SESSION_SECRET`: Secret key for sessions
   - `NODE_ENV`: Environment (development/production)
   - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
   - `CLOUDINARY_API_KEY`: Your Cloudinary API key
   - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret
   - `ADMIN_PASSWORD`: (Optional) Default admin password (defaults to 'admin123')
   
   See `CLOUDINARY_SETUP.md` for detailed Cloudinary setup instructions.

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Admin User**
   A default admin user is automatically created when the database connects:
   - **Username**: `admin`
   - **Password**: `admin123` (or the value set in `ADMIN_PASSWORD` env variable)
   
   ⚠️ **IMPORTANT**: Change the password after first login!
   
   If you need to create an admin manually, you can also run:
   ```bash
   node scripts/createAdmin.js
   ```

6. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

7. **Access the website**
   - Public site: `http://localhost:3000`
   - Admin panel: `http://localhost:3000/admin/login`

## Project Structure

```
Ikenga-site/
├── config/
│   ├── database.js       # MongoDB connection
│   └── multer.js         # File upload configuration
├── controllers/
│   ├── adminController.js
│   ├── authController.js
│   └── publicController.js
├── middleware/
│   ├── auth.js          # Authentication middleware
│   └── viewData.js      # Common view data
├── models/
│   ├── Admin.js
│   ├── Achievement.js
│   ├── GoodwillMessage.js
│   ├── Philanthropic.js
│   ├── Profile.js
│   └── Settings.js
├── public/
│   ├── css/
│   │   ├── style.css    # Public site styles
│   │   └── admin.css    # Admin panel styles
│   ├── js/
│   │   ├── main.js      # Public site JavaScript
│   │   └── admin.js     # Admin panel JavaScript
│   ├── images/          # Static images
│   └── uploads/         # Uploaded files
├── routes/
│   ├── adminRoutes.js
│   └── publicRoutes.js
├── views/
│   ├── layouts/
│   │   ├── main.ejs     # Public site layout
│   │   └── admin.ejs    # Admin panel layout
│   ├── partials/
│   │   ├── header.ejs
│   │   ├── footer.ejs
│   │   ├── admin-sidebar.ejs
│   │   └── admin-header.ejs
│   ├── admin/           # Admin views
│   ├── public/          # Public views
│   └── error.ejs
├── server.js            # Main server file
└── package.json
```

## Admin Features

### Dashboard
- Overview statistics
- Quick actions
- Recent activity

### Profile Management
- Update name, title, biography
- Upload profile image
- Manage social media links

### Achievements Management
- Create, edit, delete achievements
- Upload images
- Categorize achievements
- Set display order

### Philanthropic Activities
- Manage philanthropic activities
- Upload multiple images
- Track impact

### Goodwill Messages
- View all messages
- Verify/unverify messages
- Delete messages
- Only verified messages appear on public site

### Settings
- Site title and description
- Contact email

## Public Pages

- **Home**: Hero section, story, featured content
- **Profile**: Detailed biography and information
- **Achievements**: Timeline view of accomplishments
- **Philanthropic**: Grid/list of activities
- **Goodwill Messages**: Verified community messages

## Development

### Adding New Features

1. Create model in `models/`
2. Add routes in `routes/`
3. Create controller in `controllers/`
4. Add views in `views/`
5. Update navigation if needed

### Styling

- Public site styles: `public/css/style.css`
- Admin styles: `public/css/admin.css`
- Uses CSS variables for easy theming

## Security Considerations

- Passwords are hashed using bcrypt
- Session-based authentication
- File upload validation
- Input sanitization (consider adding more)
- Protected admin routes

## Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a production MongoDB instance
3. Set secure `SESSION_SECRET`
4. Configure proper file storage for uploads
5. Use a process manager like PM2
6. Set up reverse proxy (nginx)
7. Enable HTTPS

## License

ISC

## Support

For issues or questions, please contact the development team.

