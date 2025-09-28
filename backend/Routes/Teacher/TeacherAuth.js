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

// we did not make the router.get for getting all the students like we did of all others so that is the reason we have to write this in teacherauth.js you can also make a seperate file if you want but that is really not necessary cause there is only one function
router.get('/students', auth.requireAuth, async (req, res) => {
    console.log('🎯 STUDENTS ROUTE HANDLER EXECUTING');
    console.log('👤 Authenticated teacher:', req.teacher.firstName);
    try {
        const Student = require('../../Models/Student');
        console.log('📚 About to query students...');
        const students = await Student.find({});
        console.log('✅ Students found:', students.length);
        console.log('📋 Students:', students);
        res.json(students);
    } catch (error) {
        console.error('❌ Error fetching students:', error);
        res.status(500).json({ message: 'Error fetching students' });
    }
});

module.exports = router;