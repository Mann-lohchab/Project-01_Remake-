const Notice = require('../../Models/Notice');

// GET ALL NOTICES CREATED BY THE TEACHER
const getAllNotices = async (req, res) => {
    try {
        const teacherID = req.teacherID;
        const notices = await Notice.find({ teacherID }).sort({ date: -1 }); // Latest first
        res.status(200).json(notices);
    } catch (err) {
        console.error("Error fetching notices:", err);
        res.status(500).json({ message: "Server error while fetching notices" });
    }
};

// GET NOTICES BY DATE CREATED BY THE TEACHER
const getNoticesByDate = async (req, res) => {
    const { date } = req.body;

    if (!date) {
        return res.status(400).json({ message: "Date is required" });
    }

    try {
        const teacherID = req.teacherID;
        const notices = await Notice.find({
            teacherID,
            date: new Date(date)
        });
        res.status(200).json(notices);
    } catch (err) {
        console.error("Error fetching notices by date:", err);
        res.status(500).json({ message: "Server error while fetching notices by date" });
    }
};

// CREATE NOTICE (AUTO ATTACH TEACHER ID)
const createNotice = async (req, res) => {
    const { classID, title, description, date } = req.body;

    if (!classID || !title || !description || !date) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const newNotice = new Notice({
            teacherID: req.teacherID, // auto attach
            classID,
            title,
            description,
            date: new Date(date)
        });

        await newNotice.save();

        res.status(201).json({
            message: "Notice created successfully",
            notice: newNotice
        });
    } catch (err) {
        console.error("Error creating notice:", err);
        res.status(500).json({ message: "Server error while creating notice" });
    }
};

// DELETE NOTICE (ONLY IF CREATED BY THIS TEACHER)
const deleteNotice = async (req, res) => {
    const noticeID = req.params.id;

    try {
        const notice = await Notice.findById(noticeID);

        if (!notice) {
            return res.status(404).json({ message: "Notice not found" });
        }

        // Check if this teacher created the notice
        if (notice.teacherID.toString() !== req.teacherID.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this notice" });
        }

        await Notice.findByIdAndDelete(noticeID);
        res.status(200).json({ message: "Notice deleted successfully" });
    } catch (err) {
        console.error("Error deleting notice:", err);
        res.status(500).json({ message: "Server error while deleting notice" });
    }
};

module.exports = {
    getAllNotices,
    getNoticesByDate,
    createNotice,
    deleteNotice
};