
const Timetable = require('../Models/Timetable');

// GET FULL TIMETABLE
const getFullTimetable = async (req, res) => {
    const classId = req.params.id;
    try {
        const fullTimetable = await Timetable.find({
            classId: new RegExp(`^${classId}$`, "i")
        });
        if (fullTimetable.length === 0) {
            return res.status(404).json({ message: "The timetable was not found" });
        }
        res.status(200).json(fullTimetable);
    } catch (error) {
        console.error("Error fetching timetable:", error);
        res.status(500).json({ message: "Server error while fetching timetable" });
    }
};

module.exports = {
    getFullTimetable
};
