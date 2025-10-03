
const Timetable = require('../Models/Timetable');

// GET FULL TIMETABLE BY CLASS ID
const getFullTimetable = async (req, res) => {
    const classId = req.params.classId;
    const student = req.student; // From auth middleware
    console.log(`🔍 Fetching timetable for class: ${classId} by student: ${student.studentID}`); // Added logging
    
    try {
        const fullTimetable = await Timetable.find({
            classId: new RegExp(`^${classId}$`, "i")
        });
        
        console.log(`📋 Found ${fullTimetable.length} timetable entries for class ${classId}`); // Logging results
        
        if (fullTimetable.length === 0) {
            return res.status(404).json({ message: "No timetable found for this class" });
        }
        res.status(200).json(fullTimetable);
    } catch (error) {
        console.error("❌ Error fetching timetable:", error);
        res.status(500).json({ message: "Server error while fetching timetable" });
    }
};

module.exports = {
    getFullTimetable
};
