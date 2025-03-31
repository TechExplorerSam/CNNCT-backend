const  mongoose  = require('mongoose');
const User=require('../models/User')
const UserAvailabilityTimeSlot=require('../models/UserAvailabiltyTimeSlot')
exports.registerAvailabilityForUser=async(req,res)=>{
    try{
        const {id}=req.params;
        const userId=mongoose.isValidObjectId(id);
        if(!userId){
            return res.status(400).json("Invalid User ID please check the user");
        }
        const user=await User.find({_id:id});
        
        if(!user){
            return res.status(400).json("User not found in the database this is an invalid user or delted user");
        }
         if(parseInt(req.body.UserAvailabilityTimeSlot)<0 || parseInt(req.body.UserAvailabilityTimeSlot)>24){
            return res.status(400).json("Invalid Time Slot Please Check the Time Slot and try again");
        }
        if(req.body.UserAvaiabilityday!=="Monday"&&req.body.UserAvaiabilityday!=="Tuesday"&&req.body.UserAvaiabilityday!=="Wednesday"&&req.body.UserAvaiabilityday!=="Thursday"&&req.body.UserAvaiabilityday!=="Friday"&&req.body.UserAvaiabilityday!=="Saturday"&&req.body.UserAvaiabilityday!=="Sunday"){

            return res.status(400).json("Invalid Day Please Check the Day and try again");
        }
        else if(req.body.UserAvaiabilityday==="Sunday"){
            return res.status(400).json("Sunday is not a working day  and sunday is a holiday and every user is not avaialble and try again");
        }
        const userAvailabilityTimeSlot=new UserAvailabilityTimeSlot({
            user_id:id,
            EventActivityType:req.body.EventActivityType,
            UserAvailabilityTimeSlot:req.body.UserAvailabilityTimeSlot,
            TimeZone:req.body.TimeZone,
            UserAvaiabilityday:req.body.UserAvaiabilityday,
            UserAvailabilitydate:req.body.UserAvailabilitydate,
            
        });
        await userAvailabilityTimeSlot.save();
        res.status(200).json("User Availabilty time slot created sucessfully"+userAvailabilityTimeSlot);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}
exports.updateAvailabilityForUser = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!mongoose.isValidObjectId(userId)) {
            return res.status(400).json({ message: "Invalid User ID" });
        }

        if (!Array.isArray(req.body)) {
            return res.status(400).json({ message: "Expected an array of timeslots" });
        }

        const daysToUpdate = [...new Set(
            req.body
                .filter(slot => slot.UserAvaiabilityday !== "Sunday")
                .map(slot => slot.UserAvaiabilityday)
        )];

        if (daysToUpdate.length > 0) {
            await UserAvailabilityTimeSlot.deleteMany({
                user_id: userId,
                UserAvaiabilityday: { $in: daysToUpdate }
            });
        }

        const newSlots = req.body
            .filter(slot => slot.UserAvaiabilityday !== "Sunday")
            .map(slot => ({
                user_id: userId,
                EventActivityType: slot.EventActivityType,
                UserAvailabilityTimeSlot: slot.UserAvailabilityTimeSlot,
                TimeZone: slot.TimeZone,
                UserAvaiabilityday: slot.UserAvaiabilityday,
                UserAvailabilitydate: slot.UserAvailabilitydate
            }));

        const insertedSlots = await UserAvailabilityTimeSlot.insertMany(newSlots);

        return res.status(200).json({
            message: "Time slots updated successfully",
            updatedSlots: insertedSlots
        });

    } catch (error) {
        console.error("Error updating availability:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.deleteAvailabilityForUser=async(req,res)=>{
    try{
        const {id}=req.params;
        const availabilityId=mongoose.isValidObjectId(id);
        if(!availabilityId){
            return res.status(400).json("Invalid User ID please check the user");
        }

       const userAvailabilityTimeSlot=await UserAvailabilityTimeSlot.findByIdAndDelete(id);
        if(!userAvailabilityTimeSlot){
            return res.status(400).json("User Availability Time Slot not found in the database this is an invalid user or delted user");
        }
   
            
        res.status(200).json("User Availabilty time slot deleted sucessfully");
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}


exports.getTimeSlotAvailabilityForSpecificUser = async (req, res) => {
    try {
        
        const { id } = req.params;
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ error: "Invalid User ID. Please check the user ID format." });
        }
        const userAvailabilityTimeSlot = await UserAvailabilityTimeSlot.find({ user_id: id });
        if (!userAvailabilityTimeSlot) {
            return res.status(404).json({ error: "User availability time slot not found. " });
        }
        const user = await User.findById(id).populate('AvailabilityForMeetings');
        if (!user) {
            return res.status(404).json({ error: "User not found. The user may be deleted or invalid." });
        }
        res.status(200).json({
            message: "User availability time slot fetched successfully",
            user,
            availability: userAvailabilityTimeSlot|| []
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

