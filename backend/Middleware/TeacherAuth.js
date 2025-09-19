const Teacher = require('../Models/Teacher');
const { verifyToken, extractTokenFromHeader } = require('../utlis/jwtHelpers');

// Middleware to check if teacher is authenticated using JWT
exports.requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = extractTokenFromHeader(authHeader);

        if (!token) {
            return res.status(401).json({
                message: "Access denied. No teacher token provided."
            });
        }

        // Verify the token
        const decoded = verifyToken(token);

        if (!decoded || decoded.role !== 'teacher') {
            return res.status(401).json({
                message: "Invalid teacher token."
            });
        }

        // Find the teacher
        const teacher = await Teacher.findOne({ teacherID: decoded.teacherID });

        if (!teacher) {
            return res.status(401).json({
                message: "Teacher not found."
            });
        }

        // Add teacher info to request object
        req.teacher = teacher;
        req.teacherID = teacher.teacherID;

        next();

    } catch (error) {
        console.error("Teacher auth middleware error:", error);
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: "Invalid or expired teacher token."
            });
        }
        return res.status(500).json({
            message: "Server error during teacher authentication"
        });
    }
};

// Middleware to ensure user is NOT authenticated (for login routes)
exports.requireGuest = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        return res.status(400).json({
            message: "Already authenticated. Please logout first."
        });
    }

    next();
};