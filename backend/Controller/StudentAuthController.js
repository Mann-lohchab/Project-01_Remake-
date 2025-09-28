const Student = require('../Models/Student');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utlis/jwtHelpers');

// STUDENT REGISTRATION
exports.register = async (req, res) => {
    const {
        studentID,
        firstName,
        lastName,
        fathersName,
        mothersName,
        Address,
        grade,
        email,
        password
    } = req.body;

    try {
        // Check if all required fields are provided
        if (!studentID || !firstName || !fathersName || !mothersName || !Address || !grade || !email || !password) {
            return res.status(400).json({
                message: "All required fields must be provided",
                required: ["studentID", "firstName", "fathersName", "mothersName", "Address", "grade", "email", "password"]
            });
        }

        // Check if student already exists
        const existingStudent = await Student.findOne({
            $or: [
                { studentID: studentID },
                { email: email }
            ]
        });

        if (existingStudent) {
            if (existingStudent.studentID === studentID) {
                return res.status(409).json({ message: "Student ID already exists" });
            }
            if (existingStudent.email === email) {
                return res.status(409).json({ message: "Email already registered" });
            }
        }

        // Hash the password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new student with hashed password
        const newStudent = new Student({
            studentID,
            firstName,
            lastName: lastName || '',
            fathersName,
            mothersName,
            Address,
            grade,
            email,
            password: hashedPassword // Save the hashed password
        });

        // Save the student to database
        await newStudent.save();

        // Generate JWT token for immediate login after registration
        const token = generateToken({
            studentId: newStudent._id,
            studentID: newStudent.studentID
        });

        res.status(201).json({
            message: "Registration successful",
            studentID: newStudent.studentID,
            token: token,
            expiresIn: '24h'
        });

    } catch (err) {
        console.error("Registration Error:", err);
        
        // Handle specific MongoDB errors
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            return res.status(409).json({
                message: `${field} already exists`
            });
        }
        
        res.status(500).json({ message: "Server error during registration" });
    }
};

// ADMIN: Add student with hashed password
exports.addStudent = async (req, res) => {
    const {
        studentID,
        firstName,
        lastName,
        fathersName,
        mothersName,
        Address,
        grade,
        email,
        password
    } = req.body;

    try {
        // Check if all required fields are provided
        if (!studentID || !firstName || !fathersName || !mothersName || !Address || !grade || !email || !password) {
            return res.status(400).json({
                message: "All required fields must be provided",
                required: ["studentID", "firstName", "fathersName", "mothersName", "Address", "grade", "email", "password"]
            });
        }

        // Check if student already exists
        const existingStudent = await Student.findOne({
            $or: [
                { studentID: studentID },
                { email: email }
            ]
        });

        if (existingStudent) {
            if (existingStudent.studentID === studentID) {
                return res.status(409).json({ message: "Student ID already exists" });
            }
            if (existingStudent.email === email) {
                return res.status(409).json({ message: "Email already registered" });
            }
        }

        // Hash the password before saving
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new student with hashed password
        const newStudent = new Student({
            studentID,
            firstName,
            lastName: lastName || '',
            fathersName,
            mothersName,
            Address,
            grade,
            email,
            password: hashedPassword // Save the hashed password
        });

        // Save the student to database
        await newStudent.save();

        res.status(201).json({
            message: "Student added successfully",
            student: {
                studentID: newStudent.studentID,
                firstName: newStudent.firstName,
                lastName: newStudent.lastName,
                email: newStudent.email,
                grade: newStudent.grade
            }
        });

    } catch (err) {
        console.error("Add Student Error:", err);
        
        // Handle specific MongoDB errors
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            return res.status(409).json({
                message: `${field} already exists`
            });
        }
        
        res.status(500).json({ message: "Server error while adding student" });
    }
};

// ADMIN: Update student password with hashing
exports.updateStudentPassword = async (req, res) => {
    const { studentID, newPassword } = req.body;

    if (!studentID || !newPassword) {
        return res.status(400).json({ message: "Student ID and new password are required" });
    }

    try {
        // Find the student
        const student = await Student.findOne({ studentID });

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Hash the new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update the password
        student.password = hashedPassword;
        await student.save();

        res.status(200).json({
            message: "Password updated successfully",
            studentID: student.studentID
        });

    } catch (err) {
        console.error("Update Password Error:", err);
        res.status(500).json({ message: "Server error while updating password" });
    }
};

exports.login = async (req, res) => {
    const { studentID, password } = req.body;

    if (!studentID || !password) {
        return res.status(400).json({ message: "Student ID and Password are required" });
    }
    
    try {
        // Finding the student
        const studentData = await Student.findOne({ studentID });

        if (!studentData) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Comparing the password
        const isMatch = await bcrypt.compare(password, studentData.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Update last login time (removed sessionExpiry as it's not needed with JWT)
        await Student.findByIdAndUpdate(studentData._id, {
            lastLoginAt: new Date()
        });

        // Generate JWT token
        const token = generateToken({
            studentId: studentData._id,
            studentID: studentData.studentID
        });

        // Send response with token
        res.status(200).json({
            message: `Welcome ${studentData.firstName} ${studentData.lastName || ''}`.trim(),
            token: token,
            user: {
                studentID: studentData.studentID,
                firstName: studentData.firstName,
                lastName: studentData.lastName,
                fathersName: studentData.fathersName,
                mothersName: studentData.mothersName,
                Address: studentData.Address,
                grade: studentData.grade,
                email: studentData.email,
                lastLoginAt: studentData.lastLoginAt
            }
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error during login" });
    }
};

// STUDENT LOGOUT
// With JWT, logout is handled on the client side by removing the token
// However, we can still provide an endpoint for consistency
exports.logout = async (req, res) => {
    try {
        // With JWT, we don't need to do anything server-side
        // The client should remove the token from storage
        
        // Optional: You could maintain a token blacklist here if needed
        // For now, we'll just send a success response
        
        res.status(200).json({ 
            message: "Logged out successfully. Please remove the token from your client storage." 
        });
    } catch (err) {
        console.error("Logout Error:", err);
        res.status(500).json({ message: "Server error during logout" });
    }
};
