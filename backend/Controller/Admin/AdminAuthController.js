
const Admin = require('../../Models/Admin');
const bcrypt = require('bcrypt');

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

        const sessionExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await Admin.findByIdAndUpdate(admin._id, { sessionExpiry, lastLoginAt: new Date() });

        res.cookie('admin_token', admin._id, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({
            message: `Welcome ${admin.firstName} ${admin.lastName || ''}`.trim(),
            token: admin._id, // Using admin ID as token for now
            user: {
                adminID: admin.adminID,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                lastLoginAt: admin.lastLoginAt
            }
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

