const Homework = require('../../Models/Homework');

//View all homework
const getAllHomework = async(req,res)=>{
    try{
        const homeworkList = await Homework.find().sort({date:-1});//latest first (use -1 for descending)
        res.status(200).json(homeworkList);
    }catch(err){
        console.log("Error fetching homework",err);
        res.status(500).json({message:"Server error while fetching homework"});
    }
};

//View homework in range
const getHomeworkByRange = async (req,res)=>{
    const {fromDate,toDate}= req.body;

    if(!fromDate || !toDate){
        return res.status(400).json({message:"Both fromDate and toDate are required"});
    }

    try{
        const homeworkByRange = await Homework.find({
            date: {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            }
        }).sort({date:-1});

        res.status(200).json(homeworkByRange);
    }catch(err){
        console.log("Error fetching homework by range",err);
        res.status(500).json({message:"Server error while fetching homework by range"});
    }
};

//create a Homework
const createHomework = async(req,res)=>{
    const {studentID,title,description,assignDate,dueDate,date} = req.body;

    if(!studentID || !title || !description || !assignDate || !dueDate || !date ){
        return res.status(400).json({message:"All the fields are required"});
    }

    //check if the date is today
    const today = new Date().toISOString().split('T')[0];
    const homeworkDate = new Date(date).toISOString().split('T')[0];

    if(homeworkDate !== today){
        return res.status(400).json({message:"You can only create homework for today"});
    }

    try{
        const newHomework = new Homework({
            studentID,
            title,
            description,
            assignDate,
            dueDate,
            date
        });
        await newHomework.save();

        res.status(201).json({message:"Homework created successfully",homework:newHomework});
    }catch (err){
        console.log("Error creating homework",err);
        res.status(500).json({message:"Server error while creating homework"});
    }
};

//edit homework (today only)
const editHomework = async(req,res)=>{
    const {homeworkID} = req.body;
    const updates = req.body;

    if(!homeworkID){
        return res.status(400).json({message:"Homework ID is required"});
    }

    try{
        const homework = await Homework.findById(homeworkID);
        if(!homework){
            return res.status(404).json({message:"Homework not found"});
        }

        //only allow edit if date=today
        const today = new Date().toISOString().split('T')[0];
        const homeworkDate = new Date(homework.date).toISOString().split('T')[0];

        if(homeworkDate !== today){
            return res.status(400).json({message:"You can only edit today's homework"});
        }

        delete updates.homeworkID;

        const updatedHomework = await Homework.findByIdAndUpdate(homeworkID,updates,{new:true});
        res.status(200).json({message:"Homework updated successfully",homework:updatedHomework});

    }catch(err){
        console.log("Error updating homework",err);
        res.status(500).json({message:"Server error while updating homework"});
    }
};

//delete homework
const deleteHomework = async(req,res)=>{
    const {homeworkID} = req.body;

    if(!homeworkID){
        return res.status(400).json({message:"Homework ID is required"});
    }

    try{
        const homework = await Homework.findById(homeworkID);

        if(!homework){
            return res.status(404).json({message:"Homework not found"});
        }

        //only allow delete if date=today
        const today = new Date().toISOString().split('T')[0];
        const homeworkDate = new Date(homework.date).toISOString().split('T')[0];

        if(homeworkDate !== today){
            return res.status(400).json({message:"You can only delete today's homework"});
        }

        const deletedHomework = await Homework.findByIdAndDelete(homeworkID);
        res.status(200).json({message:"Homework deleted successfully",homework:deletedHomework});

    }catch(err){
        console.log("Error deleting homework",err);
        res.status(500).json({message:"Server error while deleting homework"});
    }
};

module.exports = {
    getAllHomework,
    getHomeworkByRange,
    createHomework,
    editHomework,
    deleteHomework
};