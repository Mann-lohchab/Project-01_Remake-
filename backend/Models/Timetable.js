
const mongoose = require('mongoose');
//Schema of period
const  periodSchema = new mongoose.Schema({

    subject: {
        type: String,
        required: true
    },
    // teacher: {
    //     type: String  // or ObjectId if you have a Teacher collection
    // },
    startTime: {
        type: String, // e.g., "09:00"
        required: true
    },
    endTime: {
        type: String, // e.g., "10:00"
        required: true
    },
    // room: {
    //     type: String
    // }
});

const daySchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        required: true
    },
    periods: [periodSchema]
});

const timetableSchema = new mongoose.Schema({
    classId: {
        type: String, // or ObjectId if you have Class collection
        required: true
    },
    timetable: [daySchema]
});

// Safe Mode
const Timetable = mongoose.models.Timetable || mongoose.model('Timetable', timetableSchema);
module.exports = Timetable;