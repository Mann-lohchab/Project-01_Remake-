const Admin = require('../Models/Admin');

// Middleware to check if admin is authenticated using cookies
exports.requireAuth = async (req, res, next) => {
    try {
        const adminToken = req.cookies.admin_token;

        if (!adminToken) {
            return res.status(401).json({
                message: "Access denied. No admin token provided."
            });
        }

        const admin = await Admin.findById(adminToken);

        if (!admin) {
            return res.status(401).json({
                message: "Invalid admin token. Admin not found."
            });
        }

        // Check if session is expired
        if (admin.sessionExpiry && admin.sessionExpiry < new Date()) {
            return res.status(401).json({
                message: "Admin session expired. Please log in again."
            });
        }

        // Add admin info to request object
        req.admin = admin;
        req.adminID = admin._id;

        next();

    } catch (error) {
        console.error("Admin auth middleware error:", error);
        return res.status(500).json({
            message: "Server error during admin authentication"
        });
    }
};

// Middleware to check if admin is already logged in (for login routes)
exports.requireGuest = async (req, res, next) => {
    try {
        const adminToken = req.cookies.admin_token;

        if (!adminToken) {
            return next(); // No token, user is a guest
        }

        const admin = await Admin.findById(adminToken);

        if (admin && admin.sessionExpiry && admin.sessionExpiry > new Date()) {
            return res.status(400).json({
                message: "Admin is already logged in"
            });
        }

        next();

    } catch (error) {
        console.error("Admin guest middleware error:", error);
        next(); // Allow to continue as guest on error
    }
};