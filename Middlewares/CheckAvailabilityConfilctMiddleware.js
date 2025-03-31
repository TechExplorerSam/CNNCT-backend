const Meetings_or_Events = require('../models/Events');
const UserAvailabilityTimeSlot = require('../models/UserAvailabiltyTimeSlot');

const CheckUsersAvailabilityConflictMiddleware = async (req, res, next) => {
    try {

        const meeting_or_event = await Meetings_or_Events.findOne({
            date: req.body.date,
            time: req.body.time,
            durationmeriadian: req.body.durationmeriadian
        });

        if (meeting_or_event) {
            return res.status(400).json({ message: "Conflict: Meeting time slot is already booked." });
        }

        

        const existingUserTimeSlots = await UserAvailabilityTimeSlot.find({
            UserAvaiabilitydate: req.body.time
        });

        if (!existingUserTimeSlots.length) {
            console.log("No existing user time slots found. ");
            return next(); 
        }

        const convertDatestotime = (Usertime) => {
            if (!Usertime || typeof Usertime !== 'string') {
                throw new Error("Invalid time format received: " + Usertime);
            }
            
            let [timeunit, meridian] = Usertime.trim().split(' ');
            if (!timeunit || !meridian) {
                throw new Error("Invalid time format: Expected 'HH:MM AM/PM', got " + Usertime);
            }

            let [hours, minutes] = timeunit.split(':').map(Number);
            if (isNaN(hours) || isNaN(minutes)) {
                throw new Error("Invalid numeric time: " + Usertime);
            }

            if (meridian === 'PM' && hours !== 12) hours += 12;
            if (meridian === 'AM' && hours === 12) hours = 0;

            let date = new Date();
            date.setHours(hours, minutes, 0, 0);
            return date;
        };

        const isTimeSlotConflict = (existingSlots, newUserTimeSlot) => {
            if (!newUserTimeSlot) return false; 
            
            let [newUserStartTime, newUserEndTime] = newUserTimeSlot.split('-').map(convertDatestotime);
            console.log(`Checking time conflict for new slot: ${newUserStartTime} - ${newUserEndTime}`);

            for (let slot of existingSlots) {
                let [existingUserStartTime, existingUserEndTime] = slot.UserAvailabilityTimeSlot.split('-').map(convertDatestotime);

                if (
                    (existingUserStartTime <= newUserStartTime && existingUserEndTime > newUserStartTime) || 
                    (existingUserStartTime < newUserEndTime && existingUserEndTime >= newUserEndTime) || 
                    (newUserStartTime <= existingUserStartTime && newUserEndTime >= existingUserEndTime)
                ) {
                    return true;
                }
            }
            return false;
        };

        
        if (isTimeSlotConflict(existingUserTimeSlots, req.body.UserAvailabilityTimeSlot)) {
            return res.status(400).json({ message: "Conflict: Your event time slot is already booked by another user." });
        }

        next(); 

    } catch (error) {
        console.error("Error in Conflict Middleware:", error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = CheckUsersAvailabilityConflictMiddleware;
