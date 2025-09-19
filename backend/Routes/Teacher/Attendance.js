const express = require('express');
const router = express.Router();
const auth = require('../../Middleware/TeacherAuth');

//import controller function
const{
    getStudentAttendance,
    getAllAttendance,
    updateAttendance,
    markAttendance,
    deleteAttendance

} = require('../../Controller/Teacher/AttendanceController')

//routes
// ✅ Get student  attendance by id
router.get("/",auth.requireAuth,getAllAttendance);
//marking the attendance
router.post("/",auth.requireAuth,markAttendance);
//get student attendance by id
router.get("/:id",auth.requireAuth,getStudentAttendance);
//update attendance
router.patch("/:id",auth.requireAuth,updateAttendance);
//delete attendance
router.delete("/:id",auth.requireAuth,deleteAttendance);

module.exports = router;