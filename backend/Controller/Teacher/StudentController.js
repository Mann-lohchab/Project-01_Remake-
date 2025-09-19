const Student = require('../../Models/Student');
const Teacher = require('../../Models/Teacher');

// 1. Get all students in a teacher's class (grade + section based)
const getStudentsInClass = async (req, res) => {
    const { grade, section } = req.query;

    if (!grade || !section) {
        return res.status(400).json({ message: "Grade and section are required" });
    }

    try {
        const students = await Student.find({ grade, section });
        if (!students.length) {
            return res.status(404).json({ message: "No students found in this class" });
        }

        res.status(200).json(students);
    } catch (err) {
        console.log("Error fetching students in class", err);
        res.status(500).json({ message: "Server error while fetching students" });
    }
};

// 2. Get student by student ID
const getStudentByID = async (req, res) => {
    const studentID = req.params.id;

    try {
        const student = await Student.findOne({ studentID });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json(student);
    } catch (err) {
        console.log("Error fetching student by ID", err);
        res.status(500).json({ message: "Server error while fetching student by ID" });
    }
};

// 3. Get students by first name (case-insensitive search)
const getStudentsByName = async (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ message: "Name is required for search" });
    }

    try {
        const students = await Student.find({
            firstName: { $regex: new RegExp(name, 'i') } // Case-insensitive search
        });

        if (!students.length) {
            return res.status(404).json({ message: "No students found with this name" });
        }

        res.status(200).json(students);
    } catch (err) {
        console.log("Error searching students by name", err);
        res.status(500).json({ message: "Server error while searching students by name" });
    }
};

module.exports = {
    getStudentsInClass,
    getStudentByID,
    getStudentsByName
};