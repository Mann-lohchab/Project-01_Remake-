const jwt = require('jsonwebtoken');

// Get JWT secret from environment variable or use a default (should be in .env in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h'; // 24 hours by default

/**
 * Generate a JWT token for a student
 * @param {Object} payload - The data to encode in the token (e.g., studentId, studentID)
 * @returns {String} - The generated JWT token
 */
const generateToken = (payload) => {
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN
    });
};

/**
 * Verify and decode a JWT token
 * @param {String} token - The JWT token to verify
 * @returns {Object} - The decoded token payload
 * @throws {Error} - If token is invalid or expired
 */
const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};

/**
 * Extract token from Authorization header
 * @param {String} authHeader - The Authorization header value
 * @returns {String|null} - The extracted token or null
 */
const extractTokenFromHeader = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7); // Remove 'Bearer ' prefix
};

module.exports = {
    generateToken,
    verifyToken,
    extractTokenFromHeader,
    JWT_EXPIRES_IN
};