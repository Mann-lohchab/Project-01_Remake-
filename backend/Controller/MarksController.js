
const Marks = require('../Models/Marks');

// 1️⃣ Get Marks of All Semesters
const getAllSemesterMarks = async (req, res) => {
    const studentID = req.params.id;
    try {
        const allMarks = await Marks.find({
            studentID: new RegExp(`^${studentID}$`, "i")
        });
        if (allMarks.length === 0) {
            return res.status(404).json({ message: "No marks found for this student" });
        }
        res.status(200).json(allMarks);
    } catch (error) {
        console.error("Error fetching all semester marks:", error);
        res.status(500).json({ message: "Server error while fetching marks" });
    }
};

// 2️⃣ Get Marks of a Specific Semester
const getMarksByExamType = async (req, res) => {
    const studentID = req.params.id;
    const semester = req.params.semester;

    try {
        const semesterMarks = await Marks.find({
            studentID: new RegExp(`^${studentID}$`, "i"),
            semester
        });
        if (semesterMarks.length === 0) {
            return res.status(404).json({ message: `No marks found for Semester ${semester}` });
        }
        res.status(200).json(semesterMarks);
    } catch (error) {
        console.error("Error fetching semester marks:", error);
        res.status(500).json({ message: "Server error while fetching marks" });
    }
};

module.exports = {
    getAllSemesterMarks,
    getMarksByExamType
};
