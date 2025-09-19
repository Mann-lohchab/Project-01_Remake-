
// FIXED STUDENT AUTH ROUTES
const express = require('express');
const router = express.Router();
const validation = require('../Middleware/validation');
const studentAuthController = require('../Controller/StudentAuthController');
const auth = require('../Middleware/auth');

// REGISTRATION ROUTE
router.post('/register',
    auth.requireGuest,
    studentAuthController.register
);

// LOGIN ROUTE
router.post('/login',
    validation.validateLogin,
    auth.requireGuest,
    studentAuthController.login
);

// LOGOUT ROUTE
router.post('/logout', auth.requireAuth, studentAuthController.logout);

// ADMIN ROUTES (You should add proper admin authentication middleware)
// For now, these are protected with basic auth
router.post('/admin/add-student',
    auth.requireAuth, // You should replace this with admin-specific auth
    studentAuthController.addStudent
);

router.post('/admin/update-password',
    auth.requireAuth, // You should replace this with admin-specific auth
    studentAuthController.updateStudentPassword
);

// PROTECTED ROUTES
router.get('/profile', auth.requireAuth, (req, res) => {
    res.json({
        message: "Your profile page",
        student: req.student,
        studentId: req.studentId
    });
});

router.get('/dashboard', auth.requireAuth, (req, res) => {
    res.json({
        message: `Welcome to dashboard, ${req.student.firstName} ${req.student.lastName || ''}!`.trim(),
        studentId: req.studentId
    });
});

module.exports = router;