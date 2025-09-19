
const mongoose = require('mongoose');
//Schema of Marks
const markSchema = new mongoose.Schema({
    studentID: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    marksObtained: {
        type: Number,
        required: true
    },
    totalMarks: {
        type: Number,

    },
    examType: {
        type: String,
        enum: ['Midterm', 'Final', 'Class Test',],
        required: true
    },
    semester: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

// Safe Mode
const Marks = mongoose.models.Marks || mongoose.model('Marks', markSchema);
module.exports = Marks;