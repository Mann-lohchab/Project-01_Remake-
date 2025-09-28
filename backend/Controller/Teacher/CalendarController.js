const Calendar = require('../../Models/Calendar');

//GET ALL CALENDAR EVENTS
const getAllCalendarEvents = async(req,res)=>{
    try{
        const events = await Calendar.find().sort({date:1});
        res.status(200).json(events)
    }catch(err){
        console.log("Error fetching the Calendar details",err);
        res.status(500).json({message:"Server error while fetching calendar"})
    }
};

// Create a new calendar event (global for all students)
const createCalendarEvent = async(req,res)=>{
    const { title,description,date,category,startTime,endTime,location,targetGrade,isAllDay } = req.body;

    // Validate required fields
    if(!title || !date || !category){
        return res.status(400).json({ message: "Title, date, and category are required" });
    }
    try{
        const newEvent = new Calendar({
            studentID: "all", // Global event for all students
            title,
            description,
            date,
            category,
            startTime,
            endTime
        })
        await newEvent.save();
        res.status(201).json({ message: "Calendar event created successfully", event: newEvent });
    } catch (err) {
        console.error("Error creating calendar event:", err);
        res.status(500).json({ message: "Server error while creating calendar event" });
    }
};

module.exports = {
    getAllCalendarEvents,
    createCalendarEvent
};