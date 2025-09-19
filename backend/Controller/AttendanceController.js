const Attendance = require('../Models/Attendance');
const Student = require('../Models/Student');

// Get All Attendance for a specific student
const getAllAttendance = async (req, res) => {
    const studentID = req.params.id;
    try {
        const records = await Attendance.find({
            studentID: new RegExp(`^${studentID}$`, "i")
        });// this will allow us to not have uppercase or lower case to have impact

        res.status(200).json(records);
    } catch (err) {
        console.error("Error fetching all attendance:", err);
        res.status(500).json({ message: "Server error while fetching attendance" });
    }
};

const getAttendanceByDate = async (req, res) => {
    const studentID = req.params.id;
    const date = req.params.date;

    try {
        const recordsByDate = await Attendance.findOne({
            studentID: new RegExp(`^${studentID}$`, "i"),
            date: new Date(date),
        });

        if (!recordsByDate) {
            return res.status(404).json({ message: "No attendance record found for this date" });
        }

        res.status(200).json(recordsByDate);
    } catch (err) {
        console.error("Error fetching attendance by date:", err);
        res.status(500).json({ message: "Server error while fetching attendance" });
    }
};

// Get Attendance Summary
const AttendanceSummary = async (req, res) => {
    const studentID = req.params.id;
    try {
        const totalPresent = await Attendance.countDocuments({
            studentID: new RegExp(`^${studentID}$`, "i"),
            status: "Present"
        });
        const totalAbsent = await Attendance.countDocuments({
            studentID: new RegExp(`^${studentID}$`, "i"),
            status: "Absent"
        });
        const totalDays = totalAbsent + totalPresent;
        const percentage = totalDays ? ((totalPresent / totalDays) * 100).toFixed(2) : 0;

        res.status(200).json({
            totalPresent,
            totalAbsent,
            totalDays,
            percentage: `${percentage}%`
        });
    } catch (error) {
        console.error("Error fetching attendance summary:", error);
        res.status(500).json({ message: "Server error while fetching summary" });
    }
};

// Get Attendance in Date Range
const AttendanceByRange = async (req, res) => {
    const studentID = req.params.id;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;

    try {
        const records = await Attendance.find({
            studentID: new RegExp(`^${studentID}$`, "i"),
            date: {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            }
        }).sort({ date: 1 });


        if (records.length === 0) {
            return res.status(404).json({ message: "No attendance records found for this date range" });
        }

        res.status(200).json(records);
    } catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).json({ message: "Server error while fetching attendance" });
    }
};

module.exports = {
    getAllAttendance,
    getAttendanceByDate,
    AttendanceSummary,
    AttendanceByRange,
};