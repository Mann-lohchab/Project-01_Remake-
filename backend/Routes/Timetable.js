const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');

const{
    getFullTimetable,
}=require('../Controller/TimetableController')

//ROUTES

router.get("/:classId", auth.requireAuth, (req, res) => {
    console.log(`🌐 Timetable route hit: GET /${req.params.classId}`); // Added route logging
    getFullTimetable(req, res);
});

module.exports = router