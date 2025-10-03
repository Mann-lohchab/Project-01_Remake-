const mongoose = require('mongoose');

const auditSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
        enum: ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'SYSTEM']
    },
    entityType: {
        type: String,
        required: true,
        enum: ['Teacher', 'Student', 'Class', 'Admin', 'System']
    },
    entityId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true // Admin user ID who performed the action
    },
    userRole: {
        type: String,
        required: true,
        default: 'admin'
    },
    details: {
        type: mongoose.Schema.Types.Mixed, // Flexible object for additional details
        default: {}
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Index for efficient querying
auditSchema.index({ timestamp: -1, entityType: 1, action: 1 });

const Audit = mongoose.models.Audit || mongoose.model('Audit', auditSchema);
module.exports = Audit;