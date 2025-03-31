const Events = require('../models/Events');
const User = require('../models/User');
const Bookings=require('../models/Bookings')
// my service function for creation of an event
exports.createanEvent = async (req, res) => {
    console.log(req.body)
    try {
        const event= new Events({
            EventTopic: req.body.EventTopic,
            password: req.body.password,
            Hostname: req.body.Hostname,
            description: req.body.description,
            date: req.body.date,
            time: req.body.time,
            durationmeriadian: req.body.durationmeriadian,
            banner: req.body.banner,
            link: req.body.link,
            timezone: req.body.timezone,
            duration: req.body.duration,
            attendees: req.body.attendees,
            isActive:true,
        });
        const meetingorganisinghost=await User.findOne({username:event.Hostname});
        if(!meetingorganisinghost){
            return res.status(400).json("Meeting Organising Host Not Found Meeting, the conducting Hostname must match with the name of the user who is creating this event in the database");
        }
        const meetingattendingpeople=[];
        if(event.attendees.length>1){
            const attendees_exist_or_not=await User.findOne({_id:{$in:event.attendees}})
            if(!attendees_exist_or_not){
                return res.status(400).json("One of the attendee or more than one attendees does not exist in the database and he/she need to register properly to get the meeting details")
            }
            meetingattendingpeople.push(...new Set([event.Hostname,...(event.attendees||[])]));

        }
        if(typeof event.time!=="string"|| !event.time.includes(":")){
            return res.status(400).json("Time is not in the correct format");
        }
        let [hoursunitintime,minutesunitintime]=event.time.split(':').map(Number);
         var dateNew=new Date();
         
         dateNew.setHours(hoursunitintime+1,minutesunitintime)
         event.endTime=dateNew.toTimeString().slice(0,5);
            event.startTime=event.time;
         
        

        const savedEvent = await event.save();

        res.status(201).json("Event created sucessfully"+savedEvent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


// my service function for getting all events specific to an user
exports.getEventsbelongingtoUser = async (req, res) => {
    try{
        const hostname=req.params.hostname;
         console.log(hostname)
        const events=await Events.find({Hostname:hostname});
        if(events.length==0){
            return res.status(400).json("No events found for this user");
        }

        res.status(200).json(events);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}


// my service function for getting all events in a specific time range
exports.getEventsinaSpecificTimeRange=async(req,res)=>{
    try{
        const events=await Bookings.find();
        const categeorizationofevents={
            Upcoming:[],
            Pending:[],
            Cancelled:[],
            Past:[]

        }
        
        for (let i = 0; i < events.length; i++) {
            let event = events[i];
            let eventDate = new Date(event.Bookingdate);
            let today = new Date();
        
            if (!categeorizationofevents.Upcoming) categeorizationofevents.Upcoming = [];
            if (!categeorizationofevents.Past) categeorizationofevents.Past = [];
            if (!categeorizationofevents.Cancelled) categeorizationofevents.Cancelled = [];
            if (!categeorizationofevents.Pending) categeorizationofevents.Pending = [];
        
            if (event.BookingStatus === "Cancelled") {
                categeorizationofevents.Cancelled.push(event);
            }
            else if (
                event.BookingCategoryW_R_T_Time === "Upcoming" &&
                event.BookingStatus === "Accepted" &&
                eventDate > today
            ) {
                categeorizationofevents.Upcoming.push(event);
            }
            else if (eventDate < today) {
                categeorizationofevents.Past.push(event);
            }
            else if (
                event.BookingStatus === "Pending" &&
                eventDate.toDateString() === today.toDateString()
            ) {
                categeorizationofevents.Pending.push(event);
            }
            else {
                categeorizationofevents.Pending.push(event);
            }
        }
        
        res.status(200).json(categeorizationofevents);
    }        
    catch(error){
        res.status(500).json({message:error.message});
    }
}

// service function for getting all events participants

exports.getEventParticipants = async (req, res) => {
    try {
      const event = await Events.findOne({ EventTopic: req.params.Bookingname }).populate("attendees");
      
      console.log("Event Found:", event); 
  
      if (!event) {
        return res.status(400).json({ message: "Event Not Found in Database" });
      }
  
      console.log("Attendees:", event.attendees); 
      res.status(200).json(event.attendees || []);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

// service function for adding participants to an event

exports.addParticipantToEvent=async(req,res)=>{
    try{
        const event=await Events.findByIdAndUpdate(req.params.id,{$push:{attendees:req.body.participant}},{new:true});
        res.status(200).json(event.attendees);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}

// service function for updating an event
exports.updateAnEvent=async(req,res)=>{
    try{
        const event=await Events.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.status(200).json(event);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}
// service function for deleting an event

exports.deleteEvent=async(req,res)=>{
    try{
        const event=await Events.findByIdAndDelete(req.params.id);
        res.status(200).json("Event deleted successfully and the deleted event is"+event);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}

exports.updateEventRunningStatus=async(req,res)=>{
    try{
        const event =await Events.findById(req.params.id);
        if(!event){
            return res.status(400).json("Event Not Found in database");
        }
        if(event.isActive==req.body.isActive){
            return res.status(400).json("Event is already in the same status");
        }
        else{
            event.isActive=req.body.isActive;
            await event.save();
            res.status(200).json(event);
        }
    }
    catch(error){
        res.status(500).json("Error in changing the meeting status"+{message:error.message});
    }

}
