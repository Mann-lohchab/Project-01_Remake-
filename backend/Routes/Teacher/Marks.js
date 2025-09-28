const express = require('express');
const router = express.Router();
const auth = require('../../Middleware/TeacherAuth');

//import controller function
const{
    getAllMarksForTeacher,
    getAllMarks,
    createMarks,
    editMarks,
    deleteMarks
} = require('../../Controller/Teacher/MarksController')

//routes
// ✅ Get all marks for teacher
router.get("/", auth.requireAuth, getAllMarksForTeacher);

// ✅ Get all marks by student ID
router.get("/:id", auth.requireAuth, getAllMarks);

// ✅ Create new marks
router.post("/", auth.requireAuth, createMarks);

// ✅ Edit marks by marks ID
router.patch("/:id", auth.requireAuth, editMarks);

// ✅ Delete marks by marks ID
router.delete("/:id", auth.requireAuth, deleteMarks);

module.exports = router;