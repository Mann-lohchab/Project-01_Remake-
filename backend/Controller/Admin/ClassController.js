const Class = require('../../Models/Class');
const Teacher = require('../../Models/Teacher');
const Student = require('../../Models/Student');

// 📝 Create a new class
const createClass = async (req, res) => {
    try {
        const { className, grade, section, teacherId, academicYear } = req.body;

        console.log("📥 Create Class Request Body:", req.body);

        // 🔥 Validate required fields
        if (!className || !grade || !section) {
            return res.status(400).json({ message: "Class name, grade, and section are required" });
        }

        // 🌟 Check for duplicate class name
        const existingClass = await Class.findOne({ className });
        if (existingClass) {
            return res.status(400).json({ message: "Class name already exists" });
        }

        // 📦 Create new class
        const newClass = new Class({
            className,
            grade: parseInt(grade),
            section,
            teacherId: teacherId || null,
            academicYear: academicYear || undefined,
            students: [],
            subjects: []
        });

        await newClass.save();

        console.log("✅ Class created successfully:", newClass.className);

        res.status(201).json({
            message: "Class created successfully",
            class: newClass
        });

    } catch (err) {
        console.error("❌ Error creating class:", err);
        res.status(500).json({ message: "Server error while creating class" });
    }
};

// 🔍 Get all classes
const getAllClasses = async (req, res) => {
    try {
        const classes = await Class.find({})
            .populate('teacherId', 'firstName lastName teacherID')
            .populate('students', 'firstName lastName studentID grade')
            .sort({ grade: 1, section: 1 });

        res.status(200).json(classes);
    } catch (err) {
        console.error("Error fetching classes:", err);
        res.status(500).json({ message: "Server error while fetching classes" });
    }
};

// 🔍 Get single class by ID
const getClassById = async (req, res) => {
    const classId = req.params.id;
    try {
        const classData = await Class.findById(classId)
            .populate('teacherId', 'firstName lastName teacherID subject')
            .populate('students', 'firstName lastName studentID grade email');

        if (!classData) {
            return res.status(404).json({ message: "Class not found" });
        }

        res.status(200).json(classData);
    } catch (err) {
        console.error("Error fetching class:", err);
        res.status(500).json({ message: "Server error while fetching class" });
    }
};

// 📝 Update a class
const updateClass = async (req, res) => {
    const classId = req.params.id;
    const updates = req.body;

    try {
        const updatedClass = await Class.findByIdAndUpdate(
            classId,
            updates,
            { new: true }
        ).populate('teacherId', 'firstName lastName teacherID')
         .populate('students', 'firstName lastName studentID grade');

        if (!updatedClass) {
            return res.status(404).json({ message: "Class not found" });
        }

        res.status(200).json({
            message: "Class updated successfully",
            class: updatedClass
        });
    } catch (err) {
        console.error("Error updating class:", err);
        res.status(500).json({ message: "Server error while updating class" });
    }
};

// 🗑️ Delete a class
const deleteClass = async (req, res) => {
    const classId = req.params.id;
    try {
        const deletedClass = await Class.findByIdAndDelete(classId);

        if (!deletedClass) {
            return res.status(404).json({ message: "Class not found" });
        }

        res.status(200).json({ message: "Class deleted successfully" });
    } catch (err) {
        console.error("Error deleting class:", err);
        res.status(500).json({ message: "Server error while deleting class" });
    }
};

// 👨‍🏫 Assign teacher to class
const assignTeacherToClass = async (req, res) => {
    const { classId, teacherId } = req.body;

    try {
        // Check if teacher exists
        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        // Update class with teacher
        const updatedClass = await Class.findByIdAndUpdate(
            classId,
            { teacherId },
            { new: true }
        ).populate('teacherId', 'firstName lastName teacherID subject');

        if (!updatedClass) {
            return res.status(404).json({ message: "Class not found" });
        }

        res.status(200).json({
            message: "Teacher assigned to class successfully",
            class: updatedClass
        });
    } catch (err) {
        console.error("Error assigning teacher to class:", err);
        res.status(500).json({ message: "Server error while assigning teacher" });
    }
};

// 👨‍🎓 Add student to class
const addStudentToClass = async (req, res) => {
    const { classId, studentId } = req.body;

    try {
        // Check if student exists
        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Check if student is already in the class
        const classData = await Class.findById(classId);
        if (!classData) {
            return res.status(404).json({ message: "Class not found" });
        }

        if (classData.students.includes(studentId)) {
            return res.status(400).json({ message: "Student is already in this class" });
        }

        // Add student to class
        classData.students.push(studentId);
        await classData.save();

        const updatedClass = await Class.findById(classId)
            .populate('students', 'firstName lastName studentID grade');

        res.status(200).json({
            message: "Student added to class successfully",
            class: updatedClass
        });
    } catch (err) {
        console.error("Error adding student to class:", err);
        res.status(500).json({ message: "Server error while adding student" });
    }
};

// 👨‍🎓 Remove student from class
const removeStudentFromClass = async (req, res) => {
    const { classId, studentId } = req.body;

    try {
        const classData = await Class.findById(classId);
        if (!classData) {
            return res.status(404).json({ message: "Class not found" });
        }

        // Remove student from class
        classData.students = classData.students.filter(id => id.toString() !== studentId);
        await classData.save();

        const updatedClass = await Class.findById(classId)
            .populate('students', 'firstName lastName studentID grade');

        res.status(200).json({
            message: "Student removed from class successfully",
            class: updatedClass
        });
    } catch (err) {
        console.error("Error removing student from class:", err);
        res.status(500).json({ message: "Server error while removing student" });
    }
};

module.exports = {
    createClass,
    getAllClasses,
    getClassById,
    updateClass,
    deleteClass,
    assignTeacherToClass,
    addStudentToClass,
    removeStudentFromClass
};