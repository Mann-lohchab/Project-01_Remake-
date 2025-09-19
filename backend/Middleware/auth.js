const Student = require('../Models/Student');
const { verifyToken, extractTokenFromHeader } = require('../utlis/jwtHelpers');

// Middleware to check if student is authenticated using JWT
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

        // Find student in database using the decoded studentId
        const student = await Student.findById(decoded.studentId);

        // Check if student exists
        if (!student) {
            return res.status(401).json({
                message: "Invalid token. Student not found."
            });
        }

        // Add student info to request object for use in other routes
        req.student = student;
        req.studentId = student._id;

        // Continue to next middleware or route handler
        next();

    } catch (error) {
        console.error("Auth middleware error:", error);
        return res.status(500).json({
            message: "Server error during authentication"
        });
    }
};

// Middleware to check if student is already logged in (for login/register routes)
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
            
            // Check if student exists
            const student = await Student.findById(decoded.studentId);
            
            if (student) {
                // Valid token and student exists - they're already logged in
                return res.status(400).json({
                    message: "You are already logged in"
                });
            }
        } catch (error) {
            // Token is invalid or expired - treat as guest
            console.log("Invalid token in requireGuest:", error.message);
        }

        // Continue to next middleware (login/register)
        next();

    } catch (error) {
        console.error("Guest middleware error:", error);
        // In case of error, allow to continue as guest
        next();
    }
};