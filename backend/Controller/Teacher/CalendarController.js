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
module.exports = {
    getAllCalendarEvents
};
//teacher will not have the access to create any updates in the calendar cause it is responsible for its class only not the whole schoool