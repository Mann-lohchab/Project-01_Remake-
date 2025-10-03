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
const Class = require('../../Models/Class');
const { createAuditLog } = require('./AuditController');
const bcrypt = require('bcrypt');

// 📝 Add a new teacher
const createTeacher = async (req, res) => {
    try {
        const { teacherID, firstName, lastName, Address, email, phone, subject, assignedClasses, password } = req.body;

        console.log("📥 Add Teacher Request Body:", req.body);

        // 🔥 Validate required fields
        if (!teacherID || !firstName || !Address || !email || !phone || !subject || !password) {
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
            teacherID,
            firstName,
            lastName,
            Address,
            email,
            phone,
            subject,
            assignedClasses: assignedClasses || [],
            password: hashedPassword
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

// 🗑️ Delete a teacher with cascading deletions and audit logging
const deleteTeacher = async (req, res) => {
    const teacherID = req.params.id;
    const adminId = req.admin?.id || req.user?.id || 'system'; // Get admin ID from auth middleware

    try {
        // Find the teacher first to get details for cascading and audit
        const teacher = await Teacher.findOne({ teacherID: teacherID });
        if (!teacher) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        // Start cascading deletions
        const cascadeResults = {
            classesUpdated: 0,
            subjectsRemoved: 0
        };

        // 1. Remove teacher from classes where they are the main teacher
        const classesAsMainTeacher = await Class.updateMany(
            { teacherId: teacher._id },
            { $unset: { teacherId: null } }
        );
        cascadeResults.classesUpdated += classesAsMainTeacher.modifiedCount;

        // 2. Remove teacher from subjects array in classes
        const classesWithSubjects = await Class.updateMany(
            { 'subjects.teacherId': teacher._id },
            { $pull: { subjects: { teacherId: teacher._id } } }
        );
        cascadeResults.subjectsRemoved += classesWithSubjects.modifiedCount;

        // 3. Delete the teacher
        await Teacher.findOneAndDelete({ teacherID: teacherID });

        // 4. Create audit log
        const auditDetails = {
            teacherInfo: {
                teacherID: teacher.teacherID,
                firstName: teacher.firstName,
                lastName: teacher.lastName,
                email: teacher.email,
                subject: teacher.subject
            },
            cascadeResults,
            deletedBy: adminId
        };

        await createAuditLog(
            'DELETE',
            'Teacher',
            teacherID,
            adminId,
            `Deleted teacher ${teacher.firstName} ${teacher.lastName || ''} (${teacher.teacherID}) with cascading deletions`,
            auditDetails,
            req
        );

        console.log(`✅ Teacher ${teacherID} deleted successfully with cascading deletions:`, cascadeResults);

        res.status(200).json({
            message: "Teacher deleted successfully with cascading deletions",
            cascadeResults
        });

    } catch (err) {
        console.error("❌ Error deleting teacher:", err);

        // Create audit log for failed deletion attempt
        await createAuditLog(
            'DELETE',
            'Teacher',
            teacherID,
            adminId,
            `Failed to delete teacher ${teacherID}: ${err.message}`,
            { error: err.message },
            req
        );

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
