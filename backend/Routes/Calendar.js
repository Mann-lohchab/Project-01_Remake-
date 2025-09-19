const express = require(`express`);
const router = express.Router();
const auth = require('../Middleware/auth');

const{
    getAllCalendarEvents,
    getCalendarByDate,
    getCalendarByRange,
}=require('../Controller/CalendarController')

//ROUTES

router.get("/",auth.requireAuth,getAllCalendarEvents);
router.get("/date/:date",auth.requireAuth,getCalendarByDate);
router.get("/date/range",auth.requireAuth,getCalendarByRange);

module.exports = router;
