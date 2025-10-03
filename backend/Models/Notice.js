const mongoose = require('mongoose');

//this is schema of notice
const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    classId: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
});

// Safe Mode
const Notice = mongoose.models.Notice || mongoose.model('Notice', noticeSchema);
module.exports = Notice;