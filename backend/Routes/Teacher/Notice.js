const express = require('express');
const router = express.Router();
const auth = require('../../Middleware/TeacherAuth');

// import controller functions
const {
    getAllNotices,
    getNoticesByDate,
    createNotice,
    deleteNotice
} = require('../../Controller/Teacher/NoticeController');

// routes
router.get("/", auth.requireAuth, getAllNotices);
router.post("/date", auth.requireAuth, getNoticesByDate);
router.post("/", auth.requireAuth, createNotice);
router.delete("/:id", auth.requireAuth, deleteNotice);

module.exports = router;