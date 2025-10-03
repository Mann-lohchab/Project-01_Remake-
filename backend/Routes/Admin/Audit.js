const express = require('express');
const router = express.Router();
const { getAuditLogs, getAuditStats } = require('../../Controller/Admin/AuditController');
const { requireAuth: AdminAuth } = require('../../Middleware/AdminAuth');

// All audit routes require admin authentication
router.use(AdminAuth);

// Get audit logs with filtering and pagination
router.get('/', getAuditLogs);

// Get audit statistics
router.get('/stats', getAuditStats);

module.exports = router;