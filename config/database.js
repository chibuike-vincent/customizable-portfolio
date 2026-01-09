const mongoose = require('mongoose');
const Admin = require('../models/Admin');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Automatically create admin user if it doesn't exist
    await createDefaultAdmin();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const createDefaultAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create default admin user
    const admin = new Admin({
      username: 'admin',
      password: process.env.ADMIN_PASSWORD || 'admin123' // Use env variable or default
    });

    await admin.save();
    console.log('✅ Default admin user created successfully!');
    console.log('   Username: admin');
    console.log('   Password: ' + (process.env.ADMIN_PASSWORD || 'admin123'));
    console.log('   ⚠️  IMPORTANT: Change the password after first login!');
  } catch (error) {
    console.error('Error creating default admin:', error.message);
    // Don't exit - allow server to continue even if admin creation fails
  }
};

module.exports = connectDB;

