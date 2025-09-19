const mongoose = require('mongoose');

// Schema of Teacher
const teacherSchema = new mongoose.Schema({
    teacherID: {
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
    Address: {
        type: String,
        required: true
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
}, {
    timestamps: true
});

// Safe Mode
const Teacher = mongoose.models.Teacher || mongoose.model('Teacher', teacherSchema);
module.exports = Teacher;