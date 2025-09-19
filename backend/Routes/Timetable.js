const express = require('express');
const router = express.Router();
const auth = require('../Middleware/auth');

const{
    getFullTimetable,
}=require('../Controller/TimetableController')

//ROUTES

router.get("/:id",auth.requireAuth,getFullTimetable);


module.exports = router