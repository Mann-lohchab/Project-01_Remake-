const express = require('express');
const router = express.Router();
const auth = require('../../Middleware/TeacherAuth');

//import controller function
const {
    getAllCalendarEvents,
    createCalendarEvent
} = require('../../Controller/Teacher/CalendarController');

//routes
// ✅ Get all calendar events
router.get("/", auth.requireAuth, getAllCalendarEvents);

// ✅ Create a new calendar event
router.post("/", auth.requireAuth, createCalendarEvent);

module.exports = router;