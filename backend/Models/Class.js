const mongoose = require('mongoose');

// Schema of Class
const classSchema = new mongoose.Schema({
    className: {
        type: String,
        required: true,
        unique: true
    },
    grade: {
        type: Number,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher',
        default: null
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    subjects: [{
        subject: String,
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Teacher'
        }
    }],
    academicYear: {
        type: String,
        required: true,
        default: () => {
            const now = new Date();
            const year = now.getFullYear();
            return `${year}-${year + 1}`;
        }
    }
}, {
    timestamps: true
});

// Safe Mode: Prevent OverwriteModelError
const Class = mongoose.models.Class || mongoose.model('Class', classSchema);
module.exports = Class;