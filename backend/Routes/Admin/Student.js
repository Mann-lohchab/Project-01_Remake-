
const express = require('express');
const router = express.Router();
const auth = require('../../Middleware/AdminAuth');
const validation = require('../../Middleware/Validation');

// 💥 Import Controller
const {
    addStudent,
    deleteStudent,
    getAllStudents,
    getStudentById,
    updateStudent
} = require('../../Controller/Admin/StudentController');

// 🌟 Routes

// Get all students
router.get("/", auth.requireAuth, getAllStudents);

// Get single student by ID
router.get("/:id", auth.requireAuth, getStudentById);

// Add new student
router.post("/", auth.requireAuth, addStudent);

// Update student
router.patch("/:id", auth.requireAuth, updateStudent);

// Delete student
router.delete("/:id", auth.requireAuth, deleteStudent);

module.exports = router;


