
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
        enum: ['Midterm', 'Final', 'Class Test', 'Assignment', 'Quiz'],
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

// Add compound unique index to prevent duplicate marks for same student-subject-exam-semester
markSchema.index({ studentID: 1, subject: 1, examType: 1, semester: 1 }, { unique: true });

// Safe Mode
const Marks = mongoose.models.Marks || mongoose.model('Marks', markSchema);
module.exports = Marks;