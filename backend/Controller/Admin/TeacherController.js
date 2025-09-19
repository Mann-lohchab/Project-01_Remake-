// const Teacher = require('../../Models/Teacher');
//
// //  Get all teachers
// const getAllTeachers = async (req, res) => {
//     try {
//         const teachers = await Teacher.find({});
//         res.status(200).json(teachers);
//     } catch (err) {
//         console.error("Error fetching teachers:", err);
//         res.status(500).json({ message: "Server error while fetching teachers" });
//     }
// };
//
// //  Get single teacher by ID
// const getTeacherById = async (req, res) => {
//     const teacherID = req.params.id;
//     try {
//         const teacher = await Teacher.findOne({ teacherID: teacherID });
//         if (!teacher) {
//             return res.status(404).json({ message: "Teacher not found" });
//         }
//         res.status(200).json(teacher);
//     } catch (err) {
//         console.error("Error fetching teacher:", err);
//         res.status(500).json({ message: "Server error while fetching teacher" });
//     }
// };
//
// //  Add a new teacher
// const createTeacher = async (req, res) => {
//     const { teachersID, firstName, lastName, Address, email, password } = req.body;
//
//     if (!teachersID || !firstName || !Address || !email || !password) {
//         return res.status(400).json({ message: "All required fields must be filled" });
//     }
//
//     try {
//         // Check if teachersID or email already exists
//         const existingTeacher = await Teacher.findOne({ $or: [{ teacherID }, { email }] });
//         if (existingTeacher) {
//             return res.status(409).json({ message: "Teacher ID or Email already exists" });
//         }
//
//         const newTeacher = new Teacher({
//             teacherID,
//             firstName,
//             lastName,
//             Address,
//             email,
//             password, // Assume hashed if frontend handles it; else hash here
//         });
//
//         await newTeacher.save();
//         res.status(201).json({ message: "Teacher created successfully", teacher: newTeacher });
//     } catch (err) {
//         console.error("Error creating teacher:", err);
//         res.status(500).json({ message: "Server error while creating teacher" });
//     }
// };
//
// //  Update a teacher
// const updateTeacher = async (req, res) => {
//     const teacherID = req.params.id;
//     const updates = req.body;
//
//     try {
//         const updatedTeacher = await Teacher.findOneAndUpdate(
//             { teacherID: teacherID },
//             updates,
//             { new: true }
//         );
//         if (!updatedTeacher) {
//             return res.status(404).json({ message: "Teacher not found" });
//         }
//         res.status(200).json({ message: "Teacher updated successfully", teacher: updatedTeacher });
//     } catch (err) {
//         console.error("Error updating teacher:", err);
//         res.status(500).json({ message: "Server error while updating teacher" });
//     }
// };
//
// //  Delete a teacher
// const deleteTeacher = async (req, res) => {
//     const teacherID = req.params.id;
//     try {
//         const deletedTeacher = await Teacher.findOneAndDelete({ teacherID: teacherID });
//         if (!deletedTeacher) {
//             return res.status(404).json({ message: "Teacher not found" });
//         }
//         res.status(200).json({ message: "Teacher deleted successfully" });
//     } catch (err) {
//         console.error("Error deleting teacher:", err);
//         res.status(500).json({ message: "Server error while deleting teacher" });
//     }
// };
//
// module.exports = {
//     getAllTeachers,
//     getTeacherById,
//     createTeacher,
//     updateTeacher,
//     deleteTeacher
// };
const Teacher = require('../../Models/Teacher');
const bcrypt = require('bcrypt');

// 📝 Add a new teacher
const createTeacher = async (req, res) => {
    try {
        const { teacherID, firstName, lastName, Address, email, password } = req.body;

        console.log("📥 Add Teacher Request Body:", req.body);

        // 🔥 Validate required fields
        if (!teacherID || !firstName || !Address || !email || !password) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        // 🌟 Check for duplicate teacherID or email
        const existingTeacher = await Teacher.findOne({
            $or: [{ teacherID }, { email }]
        });

        if (existingTeacher) {
            if (existingTeacher.teacherID === teacherID) {
                return res.status(400).json({ message: "Teacher ID already exists" });
            }
            if (existingTeacher.email === email) {
                return res.status(400).json({ message: "Email already exists" });
            }
        }

        // 🔒 Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 📦 Create new teacher
        const newTeacher = new Teacher({
            teacherID,      // ← FIXED: was teachersID
            firstName,
            lastName,
            Address,
            email,
            password: hashedPassword  // ← FIXED: now hashed
        });

        await newTeacher.save();

        console.log("✅ Teacher created successfully:", newTeacher.teacherID);

        res.status(201).json({
            message: "Teacher added successfully",
            teacher: {
                teacherID: newTeacher.teacherID,
                firstName: newTeacher.firstName,
                email: newTeacher.email
            }
        });

    } catch (err) {
        console.error("❌ Error adding teacher:", err);

        if (err.code === 11000) {
            if (err.keyPattern.teacherID) {
                return res.status(400).json({ message: "Teacher ID already exists" });
            }
            if (err.keyPattern.email) {
                return res.status(400).json({ message: "Email already exists" });
            }
        }

        res.status(500).json({ message: "Server error while adding teacher" });
    }
};

// 🔍 Get single teacher by ID
const getTeacherById = async (req, res) => {
    const teacherID = req.params.id;
    try {
        const teacher = await Teacher.findOne({ teacherID: teacherID }); // ← FIXED: was teachersID
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        res.status(200).json(teacher);
    } catch (err) {
        console.error("Error fetching teacher:", err);
        res.status(500).json({ message: "Server error while fetching teacher" });
    }
};

// 🗑️ Delete a teacher
const deleteTeacher = async (req, res) => {
    const teacherID = req.params.id;
    try {
        const deletedTeacher = await Teacher.findOneAndDelete({ teacherID: teacherID }); // ← FIXED: was teachersID
        if (!deletedTeacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        res.status(200).json({ message: "Teacher deleted successfully" });
    } catch (err) {
        console.error("Error deleting teacher:", err);
        res.status(500).json({ message: "Server error while deleting teacher" });
    }
};

// 📝 Update a teacher
const updateTeacher = async (req, res) => {
    const teacherID = req.params.id;
    const updates = req.body;

    try {
        const updatedTeacher = await Teacher.findOneAndUpdate(
            { teacherID: teacherID }, // ← FIXED: was teachersID
            updates,
            { new: true }
        );
        if (!updatedTeacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }
        res.status(200).json({ message: "Teacher updated successfully", teacher: updatedTeacher });
    } catch (err) {
        console.error("Error updating teacher:", err);
        res.status(500).json({ message: "Server error while updating teacher" });
    }
};

// 📦 Get all teachers (this one was correct)
const getAllTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find({}).sort({ createdAt: -1 });
        res.status(200).json(teachers);
    } catch (err) {
        console.error("Error fetching teachers:", err);
        res.status(500).json({ message: "Server error while fetching teachers" });
    }
};

module.exports = {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher
};
