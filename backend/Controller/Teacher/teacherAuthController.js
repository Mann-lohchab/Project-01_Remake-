const Teacher = require('../../Models/Teacher');
const bcrypt = require('bcrypt');
const { generateToken } = require('../../utlis/jwtHelpers');

exports.login = async(req, res) => {
    const { teacherID, password } = req.body;
    console.log("🔍 Login attempt - TeacherID:", teacherID, "Password:", password);

    if (!teacherID || !password) {
        return res.status(400).json({ message: "TeacherID and password are required" });
    }

    try {
        // Finding the teacher
        const teacherData = await Teacher.findOne({ teacherID: teacherID });
        console.log("👤 Teacher found:", teacherData ? "YES" : "NO");

        if (!teacherData) {
            return res.status(404).json({ message: "Teacher not found" });
        }

        console.log("🔐 Stored hash:", teacherData.password);
        console.log("🔑 Input password:", password);

        // Comparing passwords
        const isMatch = await bcrypt.compare(password, teacherData.password);
        console.log("✅ Password match:", isMatch);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Update last login
        await Teacher.findByIdAndUpdate(teacherData._id, {
            lastLoginAt: new Date()
        });

        // Generate JWT token
        const token = generateToken({
            teacherID: teacherData.teacherID,
            id: teacherData._id,
            role: 'teacher'
        });

        res.status(200).json({
            message: `Welcome ${teacherData.firstName} ${teacherData.lastName || ''}`.trim(),
            teacherID: teacherData.teacherID,
            email: teacherData.email,
            token: token
        });

    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server error during login" });
    }
};

// Logout for teacher
exports.logout = async(req, res) => {
    // For JWT, logout is handled client-side by removing the token
    res.status(200).json({ message: "Teacher logged out successfully" });
};