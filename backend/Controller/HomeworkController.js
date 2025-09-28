
const Homework = require('../Models/Homework');

// Get All Homework for a specific student
const getAllHomework = async (req, res) => {
    const studentID = req.params.id;
    console.log('🔍 getAllHomework called for studentID:', studentID);
    try {
        // First, find the student's grade
        const Student = require('../Models/Student');
        const student = await Student.findOne({ studentID: new RegExp(`^${studentID}$`, "i") });
        if (!student) {
            console.log('❌ Student not found');
            return res.status(404).json({ message: "Student not found" });
        }
        const grade = student.grade;
        console.log('🔍 Student grade:', grade);

        const records = await Homework.find({ grade });
        console.log('✅ Found homework records:', records.length, records);
        res.status(200).json(records);
    } catch (error) {
        console.error("❌ Error fetching all Homework:", error);
        res.status(500).json({ message: "Server error while fetching Homework" });
    }
};

// Get Homework By Date (ignores time, only matches date)
const getHomeworkByDate = async (req, res) => {
    const studentID = req.params.id;
    const dateParam = req.params.date;

    try {
        // Find student grade
        const Student = require('../Models/Student');
        const student = await Student.findOne({ studentID: new RegExp(`^${studentID}$`, "i") });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        const grade = student.grade;

        const startDate = new Date(dateParam);
        const endDate = new Date(dateParam);
        endDate.setHours(23, 59, 59, 999);

        const recordsByDate = await Homework.find({
            grade,
            date: { $gte: startDate, $lte: endDate }
        });

        if (recordsByDate.length === 0) {
            return res.status(404).json({ message: "No Homework record found for this date" });
        }

        res.status(200).json(recordsByDate);
    } catch (error) {
        console.error("Error fetching Homework by date:", error);
        res.status(500).json({ message: "Server error while fetching Homework" });
    }
};

// Get Homework in Date Range
const getHomeworkByRange = async (req, res) => {
    const studentID = req.params.id;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;

    if (!fromDate || !toDate) {
        return res.status(400).json({ message: "Both fromDate and toDate are required" });
    }

    try {
        // Find student grade
        const Student = require('../Models/Student');
        const student = await Student.findOne({ studentID: new RegExp(`^${studentID}$`, "i") });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        const grade = student.grade;

        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);

        const records = await Homework.find({
            grade,
            date: { $gte: startDate, $lte: endDate }
        });

        if (records.length === 0) {
            return res.status(404).json({ message: "No Homework records found for this date range" });
        }

        res.status(200).json(records);
    } catch (error) {
        console.error("Error fetching Homework:", error);
        res.status(500).json({ message: "Server error while fetching Homework" });
    }
};

module.exports = {
    getAllHomework,
    getHomeworkByDate,
    getHomeworkByRange
};
