const express = require('express');
const router = express.Router();
const auth = require('../../Middleware/TeacherAuth');

//import controller function
const {
    getAllCalendarEvents
} = require('../../Controller/Teacher/CalendarController');

//routes
// ✅ Get all calendar events (read-only for teachers)
router.get("/", auth.requireAuth, getAllCalendarEvents);

module.exports = router;