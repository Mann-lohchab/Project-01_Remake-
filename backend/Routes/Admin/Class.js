const express = require('express');
const router = express.Router();
const classController = require('../../Controller/Admin/ClassController');
const adminAuth = require('../../Middleware/AdminAuth');

// All class routes require admin authentication
router.use(adminAuth.requireAuth);

// 📝 Create a new class
router.post('/', classController.createClass);

// 🔍 Get all classes
router.get('/', classController.getAllClasses);

// 🔍 Get single class by ID
router.get('/:id', classController.getClassById);

// 📝 Update a class
router.patch('/:id', classController.updateClass);

// 🗑️ Delete a class
router.delete('/:id', classController.deleteClass);

// 👨‍🏫 Assign teacher to class
router.post('/assign-teacher', classController.assignTeacherToClass);

// 👨‍🎓 Add student to class
router.post('/add-student', classController.addStudentToClass);

// 👨‍🎓 Remove student from class
router.post('/remove-student', classController.removeStudentFromClass);

module.exports = router;