const Booking = require('../models/Bookings')
const Bookings=require('../models/Bookings')
const Events=require('../models/Events')
const EventSevices=require('./EventsServices')
const mongoose=require('mongoose')
exports.createanUserBooking=async(req,res)=>{
    try{
        const {id}=req.params;
        const eventid=mongoose.isValidObjectId(id);
        if(!eventid){
            return res.status(400).json("Invalid Event ID please check the event ID");
        }
        const event=await Events.findById(req.params.id);
        if(!event){
            res.status(400).json("Event you are trying to book is not found in the database");
        }
    
            const newbookingofuser=new Bookings({
                Bookingname:event.EventTopic,
                Bookingdate:req.body.Bookingdate,
                BookingEventDate:event.date,
                BookingEventtype:event.Eventtype,
                BookingCategoryW_R_T_Time:"Upcoming",
                BookingStatus:"Accepted",
                BookingTime:event.time,
                BookingTimeDuration:event.startTime+"-"+event.endTime,
                BookingUser:req.body.BookingUser,
                BookingNumberOfPersons:event.attendees.length,
                BookingTotalCountOfPersons:event.attendees.length+1,

                                              })
                   
                    await newbookingofuser.save();
                    res.status(201).json("Users Booking created  and event is updated sucessfully "+newbookingofuser+event);
                     event.attendees.push(req.body.BookingUser)
                    await event.save();
                    }
    catch(error){
        res.status(500).json({message:error.message});
    }


}

exports.getBookingsSpecificToUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid User ID, please check the user" });
        }

        let userbookings = await Bookings.find({ BookingUser: id });
        if (!userbookings || userbookings.length === 0) {
            return res.status(400).json({ message: "No Bookings found for the specified user in the database" });
        }

        const categorizedevent = await EventSevices.getEventsinaSpecificTimeRange(req); 
        userbookings = categorizedevent;

        res.status(200).json(userbookings);

    } catch (error) {
        if (!res.headersSent) { 
            res.status(500).json({ message: error.message });
        }
    }
};







