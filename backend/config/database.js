const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('✅ MongoDB connected successfully');
    } catch (err) {
        console.error('❌ MongoDB connection failed:', err.message);
        console.log('🔄 Server will continue without database connection');
        // Don't exit - let server start without DB for now
        return false;
    }
    return true;
};
module.exports = connectDB;
