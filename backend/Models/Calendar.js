
const mongoose = require('mongoose');
// Schema of Calender
const calendarSchema = new mongoose.Schema({
    studentID: {
        type: String,
        required: false // Optional for admin/school-wide events
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        enum: ['Holiday', 'Exam', 'Event', 'Reminder', 'Other'], // you can customize this
        default: 'Other'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Safe Mode
const Calendar = mongoose.models.Calendar || mongoose.model('Calendar', calendarSchema);
module.exports = Calendar;
