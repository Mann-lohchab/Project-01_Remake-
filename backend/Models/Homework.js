const mongoose = require('mongoose');

// Schema of homework
const homeworkSchema = new mongoose.Schema({
    studentID:{
        type: String,
        required:true
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    assignDate: {
        type: Date,
        required: true
    },
    dueDate: {
        type: Date,
        required: true,
    },
    date: {  // ADD THIS FIELD
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

// Safe Mode
const Homework = mongoose.models.Homework || mongoose.model('Homework', homeworkSchema);
module.exports = Homework;