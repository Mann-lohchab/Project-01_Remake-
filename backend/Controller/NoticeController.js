const Notice = require('../Models/Notice');

// GET NOTICES BY CLASS ID (for student access via class)
const getNoticesByClass = async (req, res) => {
    const classId = req.params.classId;
    const student = req.student; // From auth middleware
    console.log(`🔍 Fetching notices for class: ${classId} by student: ${student.studentID}`); // Added logging
    
    try {
        const notices = await Notice.find({
            classId: new RegExp(`^${classId}$`, "i")
        }).sort({ date: -1 });
        
        console.log(`📋 Found ${notices.length} notices for class ${classId}`); // Logging results
        
        if (notices.length === 0) {
            return res.status(404).json({ message: "No notices found for this class" });
        }
        res.status(200).json(notices);
    } catch (error) {
        console.error("❌ Error fetching notices by class:", error);
        res.status(500).json({ message: "Server error while fetching notices" });
    }
};

// GET NOTICES BY CLASS AND DATE RANGE
const getNoticesByClassAndDate = async (req, res) => {
    const classId = req.params.classId;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    const student = req.student; // From auth middleware
    console.log(`🔍 Fetching notices for class: ${classId} from ${fromDate} to ${toDate} by student: ${student.studentID}`); // Added logging
    
    try {
        const notices = await Notice.find({
            classId: new RegExp(`^${classId}$`, "i"),
            date: { $gte: new Date(fromDate), $lte: new Date(toDate) }
        }).sort({ date: -1 });
        
        console.log(`📋 Found ${notices.length} notices for class ${classId} in date range`); // Logging results
        
        if (notices.length === 0) {
            return res.status(404).json({ message: "No notices found for this class and date range" });
        }
        res.status(200).json(notices);
    } catch (error) {
        console.error("❌ Error fetching notices by class and date:", error);
        res.status(500).json({ message: "Server error while fetching notices" });
    }
};

module.exports = {
    getNoticesByClass,
    getNoticesByClassAndDate
};
