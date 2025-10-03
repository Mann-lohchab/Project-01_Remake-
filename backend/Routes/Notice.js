const express = require(`express`);
const router = express.Router();
const auth = require('../Middleware/auth');

const{
    getNoticesByClass,
    getNoticesByClassAndDate
} = require('../Controller/NoticeController')

// Class-based routes for notices
router.get("/class/:classId", auth.requireAuth, (req, res) => {
    console.log(`🌐 Notice route hit: GET /class/${req.params.classId}`); // Added route logging
    getNoticesByClass(req, res);
});
router.get("/class/:classId/range", auth.requireAuth, (req, res) => {
    console.log(`🌐 Notice route hit: GET /class/${req.params.classId}/range?fromDate=${req.query.fromDate}&toDate=${req.query.toDate}`); // Added route logging
    getNoticesByClassAndDate(req, res);
});

module.exports = router