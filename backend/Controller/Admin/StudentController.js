// const Student = require('../../Models/Student');
//
// //get all students
//
// const getAllStudents = async (req,res)=>{
//     try{
//         const students = await students.find({});
//         return res.status(200).json(students)
//     }catch (err){
//         console.error("Error fetching students data",err);
//         return res.status(500).json({message:"Server error while fetching students"});
//     }
// };
// //Get single student by ID
// const getStudentById = async(req,res)=>{
//     const studentID = req.params.id;
//     try{
//         const student = await student.findOne({studentID});
//         if(!student){
//             return res.status(404).json({message:"Student not found"})
//         }
//         return res.status(200).json(student);
//     }catch (err) {
//         console.error("Error fetching student:", err);
//         res.status(500).json({ message: "Server error while fetching student" });
//     }
// };
// //  Add a new student
// const createStudent = async (req, res) => {
//     const { studentID, firstName, lastName, fathersName, mothersName, Address, grade, section, email, password } = req.body;
//
//     // Check all required fields
//     if (!studentID || !firstName || !fathersName || !mothersName || !Address || !grade || !email || !password) {
//         return res.status(400).json({ message: "All required fields must be filled" });
//     }
//
//     try {
//         // Check if studentID or email already exists
//         const existingStudent = await Student.findOne({ $or: [{ studentID }, { email }] });
//         if (existingStudent) {
//             return res.status(409).json({ message: "Student ID or Email already exists" });
//         }
//
//         const newStudent = new Student({
//             studentID,
//             firstName,
//             lastName,
//             fathersName,
//             mothersName,
//             Address,
//             grade,
//             section,
//             email,
//             password, // Assume hashed if done at frontend; else hash here
//         });
//
//         await newStudent.save();
//         res.status(201).json({ message: "Student created successfully", student: newStudent });
//     } catch (err) {
//         console.error("Error creating student:", err);
//         res.status(500).json({ message: "Server error while creating student" });
//     }
// };
//
// //  Update a student
// const updateStudent = async (req, res) => {
//     const studentID = req.params.id;
//     const updates = req.body;
//
//     try {
//         const updatedStudent = await Student.findOneAndUpdate({ studentID }, updates, { new: true });
//         if (!updatedStudent) {
//             return res.status(404).json({ message: "Student not found" });
//         }
//         res.status(200).json({ message: "Student updated successfully", student: updatedStudent });
//     } catch (err) {
//         console.error("Error updating student:", err);
//         res.status(500).json({ message: "Server error while updating student" });
//     }
// };
//
// //  Delete a student
// const deleteStudent = async (req, res) => {
//     const studentID = req.params.id;
//     try {
//         const deletedStudent = await Student.findOneAndDelete({ studentID });
//         if (!deletedStudent) {
//             return res.status(404).json({ message: "Student not found" });
//         }
//         res.status(200).json({ message: "Student deleted successfully" });
//     } catch (err) {
//         console.error("Error deleting student:", err);
//         res.status(500).json({ message: "Server error while deleting student" });
//     }
// };
//
// module.exports = {
//     getAllStudents,
//     getStudentById,
//     createStudent,
//     updateStudent,
//     deleteStudent
// };
const Student = require('../../Models/Student');
const bcrypt = require('bcrypt');

// 📝 ADD NEW STUDENT
const addStudent = async (req, res) => {
    try {
        const {
            studentID,
            firstName,
            lastName,
            fathersName,
            mothersName,
            Address,
            grade,
            email,
            password,
            section
        } = req.body;

        console.log("📥 Add Student Request Body:", req.body);

        // 🔥 Validate required fields
        if (!studentID || !firstName || !fathersName || !mothersName || !Address || !grade || !email || !password || !section) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        // 🌟 Check for duplicate studentID or email
        const existingStudent = await Student.findOne({
            $or: [{ studentID }, { email }]
        });

        if (existingStudent) {
            if (existingStudent.studentID === studentID) {
                return res.status(400).json({ message: "Student ID already exists" });
            }
            if (existingStudent.email === email) {
                return res.status(400).json({ message: "Email already exists" });
            }
        }

        // 🔒 Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // 📦 Create new student
        const newStudent = new Student({
            studentID,
            firstName,
            lastName,
            fathersName,
            mothersName,
            Address,
            grade,
            section,
            email,
            password: hashedPassword
        });

        await newStudent.save();

        console.log("✅ Student created successfully:", newStudent.studentID);

        res.status(201).json({
            message: "Student added successfully",
            student: {
                studentID: newStudent.studentID,
                firstName: newStudent.firstName,
                email: newStudent.email,
                grade: newStudent.grade
            }
        });

    } catch (err) {
        console.error("❌ Error adding student:", err);

        if (err.code === 11000) {
            if (err.keyPattern.studentID) {
                return res.status(400).json({ message: "Student ID already exists" });
            }
            if (err.keyPattern.email) {
                return res.status(400).json({ message: "Email already exists" });
            }
        }

        res.status(500).json({ message: "Server error while adding student" });
    }
};

// 🗑️ DELETE STUDENT
const deleteStudent = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedStudent = await Student.findByIdAndDelete(id);
        if (!deletedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json({ message: "Student deleted successfully" });
    } catch (err) {
        console.error("❌ Error deleting student:", err);
        res.status(500).json({ message: "Server error while deleting student" });
    }
};

// 📦 GET ALL STUDENTS
const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });
        res.status(200).json(students);
    } catch (err) {
        console.error("❌ Error fetching students:", err);
        res.status(500).json({ message: "Server error while fetching students" });
    }
};

// 🔍 GET STUDENT BY ID
const getStudentById = async (req, res) => {
    const { id } = req.params;

    try {
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json(student);
    } catch (err) {
        console.error("❌ Error fetching student:", err);
        res.status(500).json({ message: "Server error while fetching student" });
    }
};

// 🔄 UPDATE STUDENT
const updateStudent = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedStudent = await Student.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }
        res.status(200).json({
            message: "Student updated successfully",
            student: updatedStudent
        });
    } catch (err) {
        console.error("❌ Error updating student:", err);
        res.status(500).json({ message: "Server error while updating student" });
    }
};

module.exports = {
    addStudent,
    deleteStudent,
    getAllStudents,
    getStudentById,
    updateStudent
};
