const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../Models/Admin');

// Connect to MongoDB
const connectDB = require('../config/database');

async function createAdmin() {
  try {
    // Connect to database
    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ adminID: 'admin001' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('AdminID: admin001');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const admin = new Admin({
      adminID: 'admin001',
      firstName: 'System',
      lastName: 'Administrator',
      email: 'admin@school.com',
      password: hashedPassword
    });

    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('AdminID: admin001');
    console.log('Password: admin123');
    console.log('Email: admin@school.com');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

createAdmin();