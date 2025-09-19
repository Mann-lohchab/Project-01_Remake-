
const Notice = require('../Models/Notice');

// GET FULL NOTICE
const getFullNotice = async (req, res) => {
    const studentID = req.params.id;
    try {
        const fullNotice = await Notice.find({
            studentID: new RegExp(`^${studentID}$`, "i")
        });
        if (fullNotice.length === 0) {
            return res.status(404).json({ message: "The Notice was not found" });
        }
        res.status(200).json(fullNotice);
    } catch (error) {
        console.error("Error fetching full notice:", error);
        res.status(500).json({ message: "Server error while fetching notices" });
    }
};

//GET NOTICE BY DATE
const getNoticeByDate = async (req, res) => {
    const studentID = req.params.id;
    const fromDate = req.query.fromDate;
    const toDate = req.query.toDate;
    try {
        const NoticeByDate = await Notice.find({
            studentID: new RegExp(`^${studentID}$`, "i"),
            date: { $gte: new Date(fromDate), $lte: new Date(toDate) }
        });
        if (NoticeByDate.length === 0) {
            return res.status(404).json({ message: "No Notice records found for this date range" });
        }
        res.status(200).json(NoticeByDate);
    } catch (error) {
        console.error("Error fetching notice by date:", error);
        res.status(500).json({ message: "Server error while fetching notices" });
    }
};

module.exports = {
    getFullNotice,
    getNoticeByDate
};
