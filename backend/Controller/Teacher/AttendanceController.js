const Attendance = require('../../Models/Attendance');
const Teacher = require('../../Models/Teacher');
const Student = require('../../Models/Student');

//GETTING ALL ATTENDANCE RECORDS
const getAllAttendance = async(req,res)=>{
    try{
        const records = await Attendance.find({});
        res.status(200).json(records);
    }catch(err){
        console.log("Error fetching the Attendance details",err);
        res.status(500).json({message:"Server error fetching attendance"})
    }
};

//GETTING ALL ATTENDANCE BY STUDENT ID
const getStudentAttendance = async(req,res)=>{
    const studentID = req.params.id;
    try{
        const records = await Attendance.find({studentID})
        if(!records.length){
            return res.status(404).json({message:"No attendance records found for this student"});
        }
        res.status(200).json(records);
    }catch(err){
        console.log("Error fetching student attendance",err);
        res.status(500).json({message:"Server error fetching student attendance"})
    }
};

//UPDATING AN EXISTING RECORD
const updateAttendance = async(req,res)=>{
    const studentID = req.params.id;
    const updates = req.body;

    //get today's date
    const today = new Date().toISOString().split('T')[0];
    try{
        const updatedRecord = await Attendance.findOneAndUpdate(
            {studentID,date:today},
            updates,
            {new:true}
        );
        if(!updatedRecord){
            return res.status(404).json({message:"No attendance record found for this student today"})
        }
        res.status(200).json({message:"Today's attendance updated",data: updatedRecord});
    }catch(err){
        console.log("Error updating the attendance", err);
        res.status(500).json({message:"Server error while updating the attendance"});
    }
};

// DELETE ATTENDANCE
const deleteAttendance = async(req,res)=>{
    const studentID = req.params.id;

    //Get today's attendance
    const today = new Date().toISOString().split('T')[0];

    try{
        const deletedRecord = await Attendance.findOneAndDelete({studentID,date:today});
        if(!deletedRecord){
            return res.status(404).json({message:"No attendance record found for this student today"})
        }
        res.status(200).json({message:"Today's attendance deleted successfully"})
    }catch(err){
        console.log("Error deleting attendance",err);
        res.status(500).json({message:"Server error while deleting attendance"});
    }
};

//MARKING THE ATTENDANCE
const markAttendance = async (req, res) => {
    const { studentID, status } = req.body;

    if (!studentID || !status) {
        return res.status(400).json({ message: "Student ID and status are required" });
    }

    if (!["Present", "Absent"].includes(status)) {
        return res.status(400).json({ message: "Status must be 'Present' or 'Absent'" });
    }

    try {
        // Check if student exists
        const studentExist = await Student.findOne({ studentID });
        if (!studentExist) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Get today's date
        const today = new Date().toISOString().split('T')[0];

        // Check if attendance already marked
        const existingRecord = await Attendance.findOne({ studentID, date: today });
        if (existingRecord) {
            return res.status(400).json({ message: "Attendance is already marked for today" });
        }

        // Get last totals
        const lastRecord = await Attendance.findOne({ studentID }).sort({ date: -1 });
        let totalPresent = lastRecord ? lastRecord.totalPresent : 0;
        let totalDays = lastRecord ? lastRecord.totalDays : 0;

        // Increment totals
        totalDays += 1;
        if (status === "Present") totalPresent += 1;

        // Create new attendance record
        const newRecord = new Attendance({
            studentID,
            date: today,
            status,
            totalPresent,
            totalDays
        });

        await newRecord.save();

        res.status(201).json({
            message: "The attendance has been marked successfully",
            data: newRecord
        });

    } catch (err) {
        console.log("Error marking the attendance", err);
        res.status(500).json({ message: "Server error while marking the attendance" });
    }
};

module.exports={
    getStudentAttendance,
    getAllAttendance,
    updateAttendance,
    markAttendance,
    deleteAttendance
}