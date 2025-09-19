const express = require('express');
const router = express.Router();
const auth = require('../../Middleware/TeacherAuth');

// Import controller function
const {
    getMyClassTimetable
} = require('../../Controller/Teacher/TimetableController');

// Routes
// ✅ Get teacher's class timetable
router.get("/", auth.requireAuth, getMyClassTimetable);

module.exports = router;