const express = require('express');
const router = express.Router();
const auth = require('../../Middleware/TeacherAuth');

//import controller function
const {
    getAllHomework,
    getHomeworkByRange,
    createHomework,
    editHomework,
    deleteHomework
} = require('../../Controller/Teacher/HomeworkController');

//routes
// ✅ Get all homework
router.get("/", auth.requireAuth, getAllHomework);

// ✅ Create new homework
router.post("/", auth.requireAuth, createHomework);

// ✅ Get homework by date range
router.post("/range", auth.requireAuth, getHomeworkByRange);

// ✅ Edit homework
router.patch("/", auth.requireAuth, editHomework);

// ✅ Delete homework
router.delete("/", auth.requireAuth, deleteHomework);

module.exports = router;