const eventServices=require('../Services/EventsServices');

//controller for creation of an event
exports.createAnEvent = async (req, res) => {
    try{
        const event=await eventServices.createanEvent(req,res);
        res.status(200).json(event);
    }
    catch(error){
        console.log('An error occurred while creating the event ');
    }
}


//controller for getting all events specific to a user
exports.getSpecificUserEvents=async(req,res)=>{
    try{
        const events=await eventServices.getEventsbelongingtoUser(req,res);
        res.status(200).json(events);
    }
    catch(error){
    }
}

//controller for getting all events in a specific time range
exports.getEventsInRange=async(req,res)=>{
    try{
        const events=await eventServices.getEventsinaSpecificTimeRange(req,res);
        res.status(200).json(events);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}

//controller for getting all events participants
exports.getEventParticipants=async(req,res)=>{
    try{
        const participants=await eventServices.getEventParticipants(req,res);
        res.status(200).json(participants);
    }
    catch(error){
        console.log("Error in getting event participants");
    }
}

//controller for updating an event
exports.updateAnEvent=async(req,res)=>{
    try{
        const event=await eventServices.updateAnEvent(req,res);
        res.status(200).json(event);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}
exports.deleteanevent=async(req,res)=>{
    try{
        const event=await eventServices.deleteEvent(req,res);
        res.status(200).json(event);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}

exports.UpdateRunningStatusOfanEvent=async(req,res)=>{
    try{
        const event=await eventServices.updateEventRunningStatus(req,res);
        res.status(200).json(event);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}
