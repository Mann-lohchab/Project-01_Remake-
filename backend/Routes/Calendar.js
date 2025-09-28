const express = require(`express`);
const router = express.Router();
const auth = require('../Middleware/auth');

const{
    getAllCalendarEvents,
    getCalendarByDate,
    getCalendarByRange,
}=require('../Controller/CalendarController')

//ROUTES

router.get("/:id",auth.requireAuth,getAllCalendarEvents);
router.get("/:id/date/:date",auth.requireAuth,getCalendarByDate);
router.get("/:id/range",auth.requireAuth,getCalendarByRange);

module.exports = router;
