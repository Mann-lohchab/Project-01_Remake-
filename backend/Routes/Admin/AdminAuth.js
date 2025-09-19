const express = require('express');
const router = express.Router();
const auth = require('../../Middleware/AdminAuth');
const validate = require('../../Middleware/Validation');

// Import Controller
const { login, logout } = require('../../Controller/Admin/AdminAuthController');

// 🔥 Admin Login Route
router.post('/login', validate.validateAdminLogin, auth.requireGuest, login);

// 🔥 Admin Logout Route
router.post('/logout', auth.requireAuth, logout);

module.exports = router;
