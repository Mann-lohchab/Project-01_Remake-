
const express = require(`express`);
const router = express.Router();
const auth = require('../Middleware/auth');

const{
    getFullNotice,
    getNoticeByDate
}= require('../Controller/NoticeController')

//ROUTES
router.get("/:id",auth.requireAuth, getFullNotice);
router.get("/:id/range",auth.requireAuth, getNoticeByDate);
module.exports = router