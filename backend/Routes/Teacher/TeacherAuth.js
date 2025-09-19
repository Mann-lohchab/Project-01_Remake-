const express = require('express');
const router = express.Router();
const validation = require('../../Middleware/validation');
const teacherAuthController = require('../../Controller/Teacher/teacherAuthController');
const auth = require('../../Middleware/TeacherAuth');

// ADD DEBUG MIDDLEWARE
const debugMiddleware = (req, res, next) => {
    console.log(`🔍 ${req.method} ${req.path} - Body:`, req.body);
    console.log('🔑 Auth Header:', req.headers.authorization);
    next();
};

// LOGIN ROUTE
router.post('/login',
    debugMiddleware,
    validation.validateTeacherLogin,
    auth.requireGuest,
    teacherAuthController.login
);

// LOGOUT ROUTE
router.post('/logout', auth.requireAuth, teacherAuthController.logout);

// PROTECTED ROUTES
router.get('/profile', auth.requireAuth, (req, res) => {
    res.json({
        message: "Your profile page",
        teacher: req.teacher,
        teacherId: req.teacherID
    });
});

router.get('/dashboard', auth.requireAuth, (req, res) => {
    res.json({
        message: `Welcome to dashboard, ${req.teacher.firstName} ${req.teacher.lastName || ''}!`.trim(),
        teacherId: req.teacherID
    });
});

module.exports = router;