const express = require('express');
const router = express.Router();
const auth = require('../../Middleware/AdminAuth');

// Import controller functions
const {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher
} = require('../../Controller/Admin/TeacherController');

//  Get all teachers
router.get("/", auth.requireAuth, getAllTeachers);

//  Get single teacher by teachersID
router.get("/:id", auth.requireAuth, getTeacherById);

//  Create a new teacher
router.post("/", auth.requireAuth, createTeacher);

//  Update a teacher by teachersID
router.patch("/:id", auth.requireAuth, updateTeacher);

//  Delete a teacher by teachersID
router.delete("/:id", auth.requireAuth, deleteTeacher);

module.exports = router;
