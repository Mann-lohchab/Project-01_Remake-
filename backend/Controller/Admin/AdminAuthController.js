
const Admin = require('../../Models/Admin');
const bcrypt = require('bcrypt');
const { generateToken } = require('../../utlis/jwtHelpers');

// 🔥 Login Admin
exports.login = async (req, res) => {
    const adminID = req.body.adminID || req.body.AdminID;
    const password = req.body.password || req.body.Password;

    // 🛑 Validation
    if (!adminID || !password) {
        return res.status(400).json({
            message: "Admin ID and password are required",
            received: { adminID: !!adminID, password: !!password }
        });
    }

    try {
        const admin = await Admin.findOne({ adminID });
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Update last login time
        await Admin.findByIdAndUpdate(admin._id, { lastLoginAt: new Date() });

        // Generate JWT token
        const token = generateToken({
            adminID: admin.adminID
        });

        // Return user data and token
        res.status(200).json({
            token: token,
            user: {
                id: admin.adminID,
                adminID: admin.adminID,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                role: 'admin'
            },
            expiresIn: '24h'
        });
    } catch (err) {
        console.error("Admin Login Error:", err);
        res.status(500).json({ message: "Server error during login" });
    }
};

// 🔥 Logout Admin
exports.logout = async (req, res) => {
    try {
        if (req.adminID) {
            await Admin.findByIdAndUpdate(req.adminID, { sessionExpiry: null });
        }
        res.clearCookie('admin_token');
        res.status(200).json({ message: "Admin logged out successfully" });
    } catch (err) {
        console.error("Admin Logout Error:", err);
        res.status(500).json({ message: "Server error during logout" });
    }
};

