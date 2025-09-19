exports.validateAdminLogin = async (req, res, next) => {
    try {
        const { adminID, password } = req.body;

        // Check if required fields are present
        if (!adminID || !password) {
            return res.status(400).json({
                message: "Admin ID and password are required"
            });
        }

        // Check if fields are not empty strings
        if (adminID.trim() === '' || password.trim() === '') {
            return res.status(400).json({
                message: "Admin ID and password cannot be empty"
            });
        }

        next();

    } catch (error) {
        console.error("Admin validation middleware error:", error);
        return res.status(500).json({
            message: "Server error during admin validation"
        });
    }
};