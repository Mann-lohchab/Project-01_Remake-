const Admin = require('../Models/Admin');
const { verifyToken, extractTokenFromHeader } = require('../utlis/jwtHelpers');

// Middleware to check if admin is authenticated using JWT
exports.requireAuth = async (req, res, next) => {
    try {
        // Get the Authorization header
        const authHeader = req.headers.authorization;

        // Extract token from header
        const token = extractTokenFromHeader(authHeader);

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                message: "Access denied. No token provided."
            });
        }

        // Verify the token
        let decoded;
        try {
            decoded = verifyToken(token);
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return res.status(401).json({
                    message: "Token expired. Please log in again."
                });
            } else if (error.name === 'JsonWebTokenError') {
                return res.status(401).json({
                    message: "Invalid token. Please log in again."
                });
            }
            throw error;
        }

        // Find admin in database using the decoded adminID
        const admin = await Admin.findOne({ adminID: decoded.adminID });

        // Check if admin exists
        if (!admin) {
            return res.status(401).json({
                message: "Invalid token. Admin not found."
            });
        }

        // Add admin info to request object for use in other routes
        req.admin = admin;
        req.adminID = admin._id;

        // Continue to next middleware or route handler
        next();

    } catch (error) {
        console.error("Admin auth middleware error:", error);
        return res.status(500).json({
            message: "Server error during admin authentication"
        });
    }
};

// Middleware to check if admin is already logged in (for login routes)
// With JWT, we just check if a valid token is provided
exports.requireGuest = async (req, res, next) => {
    try {
        // Get the Authorization header
        const authHeader = req.headers.authorization;

        // Extract token from header
        const token = extractTokenFromHeader(authHeader);

        // If no token, user is a guest - continue
        if (!token) {
            return next();
        }

        // Try to verify the token
        try {
            const decoded = verifyToken(token);

            // Check if admin exists
            const admin = await Admin.findById(decoded.adminId);

            if (admin) {
                // Valid token and admin exists - they're already logged in
                return res.status(400).json({
                    message: "You are already logged in"
                });
            }
        } catch (error) {
            // Token is invalid or expired - treat as guest
            console.log("Invalid token in requireGuest:", error.message);
        }

        // Continue to next middleware (login)
        next();

    } catch (error) {
        console.error("Admin guest middleware error:", error);
        // In case of error, allow to continue as guest
        next();
    }
};