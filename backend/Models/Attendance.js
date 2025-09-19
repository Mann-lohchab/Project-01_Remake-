
const mongoose = require('mongoose');
//Schema of Attendance
const attendanceSchema = new mongoose.Schema({

    date: {
        type: Date,
        required: true,
    },
    studentID: {
        type: String,
        required: true,
    },
    status:{
        type: String,
        enum: ["Present", "Absent"],
        required: true
    }

});

// Safe Mode: Prevent OverwriteModelError
const Attendance = mongoose.models.Attendance || mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance; //export Attendance
