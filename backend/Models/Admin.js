const mongoose = require('mongoose');

// Schema of Admin
const adminSchema = new mongoose.Schema({
    adminID: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    sessionExpiry: {
        type: Date,
        default: null
    },
    lastLoginAt: {
        type: Date,
        default: Date.now
    }
});

// Safe Mode
const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);
module.exports = Admin;
