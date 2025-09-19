const Timetable = require('../../Models/Timetable');

//  Get timetable for the teacher's assigned class
const getMyClassTimetable = async (req, res) => {
    try {
        const classId = req.teacher.classId; // 👈 we assume classId is stored in teacher profile

        const timetable = await Timetable.findOne({ classId });

        if (!timetable) {
            return res.status(404).json({ message: `No timetable found for class ${classId}` });
        }

        res.status(200).json(timetable);
    } catch (error) {
        console.error("Error fetching teacher's timetable:", error);
        res.status(500).json({ message: "Server error while fetching timetable" });
    }
};

module.exports = {
    getMyClassTimetable
};