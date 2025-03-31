const UserAvailabilityServices=require('../Services/UserAvailabilityServices');


//controller code for creating a new user availability time slot 
exports.createUserAvailabilityTimeSlot=async(req,res)=>{
    try{
        const userAvailabilityTimeSlot=await UserAvailabilityServices.registerAvailabilityForUser(req,res);
        res.status(200).json(userAvailabilityTimeSlot);
    }
    catch(error){
        console.log("error occurred while creating the user availability time slot");
    }
}

//controller code for updating an existing user availability time slot
exports.updateUserAvailabilityTimeSlot=async(req,res)=>{
    try{
        const userAvailabilityTimeSlot=await UserAvailabilityServices.updateAvailabilityForUser(req,res);
        res.status(200).json(userAvailabilityTimeSlot);
    }
    catch(error){
         console.log("error occurred while updating the user availability time slot");}
}

//controller code for deleting an existing user availability time slot
exports.deleteUserAvailabilityTimeSlot=async(req,res)=>{
    try{
        const userAvailabilityTimeSlot=await UserAvailabilityServices.deleteAvailabilityForUser(req,res);
        res.status(200).json(userAvailabilityTimeSlot);
    }
    catch(error){
        console.log("error occurred while deleting the user availability time slot");
    }
}

//controller code for getting the user availability time slot for a specific user
exports.getUserAvailabilityTimeSlot=async(req,res)=>{
    try{
        const userAvailabilityTimeSlot=await UserAvailabilityServices.getTimeSlotAvailabilityForSpecificUser(req,res);
        res.status(200).json(userAvailabilityTimeSlot);
    }
    catch(error){
    }
}

