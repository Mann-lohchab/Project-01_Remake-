const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');
// Import controller functions
const {
    getAllHomework,
    getHomeworkByDate,
    getHomeworkByRange
} = require('../Controller/HomeworkController');

// Routes
router.get("/:id",auth.requireAuth, getAllHomework);
router.get("/:id/date/:date",auth.requireAuth, getHomeworkByDate);
router.get("/:id/range",auth.requireAuth, getHomeworkByRange);

module.exports = router