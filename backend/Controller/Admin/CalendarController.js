const Calendar = require('../../Models/Calendar');

// ✅ Get all calendar events (sorted latest first)
const getAllCalendarEvents = async (req, res) => {
    try {
        const events = await Calendar.find({}).sort({ date: -1 });
        res.status(200).json(events);
    } catch (err) {
        console.error("Error fetching calendar events:", err);
        res.status(500).json({ message: "Server error while fetching calendar events" });
    }
};

// ✅ Create a new calendar event
const createCalendarEvent = async(req,res)=>{
    const { title,description,date,category } = req.body;

    // Validate required fields
    if(!title || !date || !category){
        return res.status(400).json({ message: "Title, date, and category are required" });
    }
    try{
        const newEvent = new Calendar({
            title,
            description,
            date,
            category
        })
        await newEvent.save();
        res.status(201).json({ message: "Calendar event created successfully", event: newEvent });
    } catch (err) {
        console.error("Error creating calendar event:", err);
        res.status(500).json({ message: "Server error while creating calendar event" });
    }
};
// ✅ Update a calendar event by ID
const updateCalendarEvent = async (req, res) => {
    const eventId = req.params.id;
    const updates = req.body;

    try {
        const updatedEvent = await Calendar.findByIdAndUpdate(eventId, updates, { new: true });
        if (!updatedEvent) {
            return res.status(404).json({ message: "Calendar event not found" });
        }
        res.status(200).json({ message: "Calendar event updated successfully", event: updatedEvent });
    } catch (err) {
        console.error("Error updating calendar event:", err);
        res.status(500).json({ message: "Server error while updating calendar event" });
    }
};

// ✅ Delete a calendar event by ID
const deleteCalendarEvent = async (req, res) => {
    const eventId = req.params.id;

    try {
        const deletedEvent = await Calendar.findByIdAndDelete(eventId);
        if (!deletedEvent) {
            return res.status(404).json({ message: "Calendar event not found" });
        }
        res.status(200).json({ message: "Calendar event deleted successfully" });
    } catch (err) {
        console.error("Error deleting calendar event:", err);
        res.status(500).json({ message: "Server error while deleting calendar event" });
    }
};

module.exports = {
    getAllCalendarEvents,
    createCalendarEvent,
    updateCalendarEvent,
    deleteCalendarEvent
};