/**
 * Utility script to hash existing plain text passwords in the database
 * Run this script once to convert all plain text passwords to hashed passwords
 * Usage: node scripts/hashExistingPasswords.js
 */

require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Student = require('../Models/Student');

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/studentDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Connected to MongoDB');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Function to check if a password is already hashed
const isPasswordHashed = (password) => {
    // bcrypt hashes always start with $2a$, $2b$, or $2y$
    return password && (password.startsWith('$2a$') || password.startsWith('$2b$') || password.startsWith('$2y$'));
};

// Main function to hash passwords
const hashExistingPasswords = async () => {
    try {
        console.log('🔄 Starting password hashing process...');
        
        // Find all students
        const students = await Student.find({});
        console.log(`📊 Found ${students.length} students in database`);
        
        let hashedCount = 0;
        let alreadyHashedCount = 0;
        let errorCount = 0;
        
        for (const student of students) {
            try {
                // Check if password is already hashed
                if (isPasswordHashed(student.password)) {
                    alreadyHashedCount++;
                    console.log(`⏭️  Student ${student.studentID}: Password already hashed`);
                    continue;
                }
                
                // Hash the plain text password
                const saltRounds = 10;
                const hashedPassword = await bcrypt.hash(student.password, saltRounds);
                
                // Update the student's password
                student.password = hashedPassword;
                await student.save();
                
                hashedCount++;
                console.log(`✅ Student ${student.studentID}: Password hashed successfully`);
                
            } catch (error) {
                errorCount++;
                console.error(`❌ Error hashing password for student ${student.studentID}:`, error.message);
            }
        }
        
        // Print summary
        console.log('\n📊 Password Hashing Summary:');
        console.log(`✅ Successfully hashed: ${hashedCount} passwords`);
        console.log(`⏭️  Already hashed: ${alreadyHashedCount} passwords`);
        console.log(`❌ Errors: ${errorCount}`);
        console.log(`📊 Total students processed: ${students.length}`);
        
    } catch (error) {
        console.error('❌ Error in hashing process:', error);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        process.exit(0);
    }
};

// Run the script
const run = async () => {
    console.log('🚀 Password Hashing Utility Script');
    console.log('===================================\n');
    
    // Confirm before proceeding
    console.log('⚠️  WARNING: This script will hash all plain text passwords in the database.');
    console.log('⚠️  Make sure you have a backup of your database before proceeding.\n');
    
    await connectDB();
    await hashExistingPasswords();
};

// Execute
run().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
});