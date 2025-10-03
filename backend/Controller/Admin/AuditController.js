const Audit = require('../../Models/Audit');

// Get audit logs with filtering and pagination
const getAuditLogs = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 50,
            action,
            entityType,
            userId,
            startDate,
            endDate,
            sortBy = 'timestamp',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = {};
        if (action) filter.action = action;
        if (entityType) filter.entityType = entityType;
        if (userId) filter.userId = userId;
        if (startDate || endDate) {
            filter.timestamp = {};
            if (startDate) filter.timestamp.$gte = new Date(startDate);
            if (endDate) filter.timestamp.$lte = new Date(endDate);
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const logs = await Audit.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .populate('userId', 'firstName lastName email')
            .lean();

        const total = await Audit.countDocuments(filter);

        res.status(200).json({
            logs,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalLogs: total,
                hasNext: parseInt(page) * parseInt(limit) < total,
                hasPrev: parseInt(page) > 1
            }
        });

    } catch (error) {
        console.error('Error fetching audit logs:', error);
        res.status(500).json({ message: 'Server error while fetching audit logs' });
    }
};

// Create audit log entry
const createAuditLog = async (action, entityType, entityId, userId, description, details = {}, req = null) => {
    try {
        const auditData = {
            action,
            entityType,
            entityId,
            userId,
            description,
            details
        };

        // Add request metadata if available
        if (req) {
            auditData.ipAddress = req.ip || req.connection.remoteAddress;
            auditData.userAgent = req.get('User-Agent');
        }

        const auditLog = new Audit(auditData);
        await auditLog.save();

        console.log(`📝 Audit log created: ${action} ${entityType} by ${userId}`);
        return auditLog;

    } catch (error) {
        console.error('Error creating audit log:', error);
        // Don't throw error to avoid breaking main operations
    }
};

// Get audit statistics
const getAuditStats = async (req, res) => {
    try {
        const { period = '7d' } = req.query;

        // Calculate date range
        const now = new Date();
        let startDate;

        switch (period) {
            case '1d':
                startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case '7d':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        }

        const stats = await Audit.aggregate([
            {
                $match: {
                    timestamp: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: {
                        action: '$action',
                        entityType: '$entityType'
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: '$_id.action',
                    entities: {
                        $push: {
                            type: '$_id.entityType',
                            count: '$count'
                        }
                    },
                    total: { $sum: '$count' }
                }
            }
        ]);

        res.status(200).json({
            period,
            startDate,
            endDate: now,
            stats
        });

    } catch (error) {
        console.error('Error fetching audit stats:', error);
        res.status(500).json({ message: 'Server error while fetching audit statistics' });
    }
};

module.exports = {
    getAuditLogs,
    createAuditLog,
    getAuditStats
};