const Marks = require('../../Models/Marks');

//get all marks by student id
const getAllMarks = async (req,res)=>{
    const studentID = req.params.id;
    try{
        const marksList = await Marks.find({studentID}).sort({date:-1});//show the latest first
        if(marksList.length === 0){
            return res.status(404).json({message:"No marks found"});
        }
        const categorizedMarks = marksList.reduce((acc,mark)=>{
            if(!acc[mark.examType]){
                acc[mark.examType] = [];
            }
            acc[mark.examType].push(mark);
            return acc;
        },{});
        res.status(200).json(categorizedMarks);
    }catch (err){
        console.log("Error fetching all marks",err);
        res.status(500).json({message:"Server error while fetching marks "});
    }
};

//create marks

const createMarks = async(req,res)=>{
    const {studentID,subject,marksObtained,totalMarks,examType,semester,date} = req.body;
    if(!studentID || !subject ||!marksObtained || !totalMarks || !examType || !semester || !date){
        return res.status(400).json({message:"Missing required fields"});
    }
    try{
        const newMarks = new Marks({
            studentID,
            subject,
            marksObtained,
            totalMarks,
            examType,
            semester,
            date:date //will have to provide a date
        });
        await newMarks.save();
        return res.status(201).json({message:"Marks created successfully",data:newMarks});
    }catch(err){
        console.log("Error creating marks",err);
        return res.status(500).json({message:"Server error while creating marks "});
    }
};
//edit marks
const editMarks = async(req,res)=>{
    const marksID = req.params.id;
    const updates = req.body;
    try{

        // Remove marksID from updates to prevent overwriting the ID
        delete updates.marksID;


        const updateMarks = await Marks.findByIdAndUpdate(marksID,updates,{new:true});
        if(!updateMarks){
            return res.status(404).json({message:"Marks not found"});
        }
        return res.status(200).json({message:"Marks updated successfully",data:updateMarks});
    }catch(err){
        console.log("Error updating marks",err);
        return res.status(500).json({message:"Server error while updating the marks"});
    }
};
//delete marks
const deleteMarks = async(req,res)=>{
    const marksID = req.params.id;
    try{
        const deletedMarks = await Marks.findByIdAndDelete(marksID);
        if(!deletedMarks){
            return res.status(404).json({message:"Marks not found"});
        }
        return res.status(200).json({message:"Marks deleted successfully",data:deletedMarks})
    }catch(err){
        console.log("Error deleting marks",err);
        return res.status(500).json({message:"Server error while deleting the marks"});
    }
};
module.exports = {
    getAllMarks,
    createMarks,
    editMarks,
    deleteMarks
};