const express = require('express');
const router = express.Router();
const auth = require('../../Middleware/AdminAuth');

// Import controller functions
const {
    getAllCalendarEvents,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent
} = require('../../Controller/Admin/CalendarController');

//  Get all calendar events
router.get("/", auth.requireAuth, getAllCalendarEvents);

//  Create a new calendar event
router.post("/", auth.requireAuth, createCalendarEvent);

//  Update a calendar event by ID
router.patch("/:id", auth.requireAuth, updateCalendarEvent);

//  Delete a calendar event by ID
router.delete("/:id", auth.requireAuth, deleteCalendarEvent);

module.exports = router;
