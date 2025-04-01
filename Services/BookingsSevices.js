const Booking = require('../models/Bookings')
const Bookings=require('../models/Bookings')
const Events=require('../models/Events')
const EventSevices=require('./EventsServices')
const mongoose=require('mongoose')


exports.createanUserBooking = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid Booking ID." });
        }

        let booking = await Bookings.findById(id);

        if (!booking) {
            console.log("Booking not found. Creating a new one...");

            const event = await Events.findOne({ EventTopic: req.body.Bookingname });
            if (!event) {
                return res.status(404).json({ message: "Event not found for this Booking name." });
            }

            booking = new Bookings({
                Bookingname: event.EventTopic,
                Bookingdate: req.body.Bookingdate,
                BookingEventDate: event.date,
                BookingEventtype: event.Eventtype,
                BookingCategoryW_R_T_Time: "Upcoming",
                BookingStatus: req.body.Bookingstatus,
                BookingTime: event.time,
                BookingTimeDuration: `${event.startTime}-${event.endTime}`,
                BookingUser: req.body.BookingUser,
                BookingNumberOfPersons: event.attendees.length,
                BookingTotalCountOfPersons: event.attendees.length + 1,
            });

            await booking.save();

            event.attendees.push(req.body.BookingUser);
            await event.save();
        }

        res.status(201).json({
            message: "User booking processed and created successfully.",
            booking: booking,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.rejectBooking = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid Booking ID." });
        }

        const booking = await Bookings.findById(id);

        if (!booking) {
            return res.status(404).json({ message: "Booking not found pdating the staus of the booking." });
        }
        booking=new Bookings({
            Bookingname: booking.Bookingname,
            Bookingdate: booking.Bookingdate,
            BookingEventDate: booking.BookingEventDate,
            BookingEventtype: booking.BookingEventtype,
            BookingCategoryW_R_T_Time: booking.BookingCategoryW_R_T_Time,
            BookingStatus: "Rejected",
            BookingTime: booking.BookingTime,
            BookingTimeDuration: booking.BookingTimeDuration,
            BookingUser: booking.BookingUser,
            BookingNumberOfPersons: booking.BookingNumberOfPersons,
            BookingTotalCountOfPersons: booking.BookingTotalCountOfPersons,
        });

       
        await booking.save();

        res.status(200).json({ message: "Booking rejected successfully." });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getBookingsSpecificToUser = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: "Invalid User ID, please check the user" });
        }

        let userbookings = await Bookings.find({ BookingUser: id });

        let userEvents = await Events.find({ attendees: id });
        
        if (!userbookings || userbookings.length === 0) {
            console.log("No bookings found for this user.");
        }
        if (!userEvents || userEvents.length === 0) {
            console.log("No events found for this user.");
        }

        let eventBookings = userEvents.map(event => ({
            _id: event._id,
            Bookingname: event.EventTopic,
            Bookingdate: event.date,
            BookingEventDate: event.date,
            BookingEventtype: event.Eventtype,
            BookingCategoryW_R_T_Time: event.date >= new Date() ? "Upcoming" : "Past",
            BookingStatus: "Accepted", 
            BookingTime: event.time,
            BookingTimeDuration: `${event.startTime}-${event.endTime}`,
            BookingUser: id,
            BookingNumberOfPersons: event.attendees.length,
            BookingTotalCountOfPersons: event.attendees.length
        }));

        let allBookings = [...userbookings, ...eventBookings];

        if (allBookings.length === 0) {
            return res.status(400).json({ message: "No bookings or events found for the specified user in the database" });
        }

        const categorizedEvents = await EventSevices.getEventsinaSpecificTimeRange(req);
        res.status(200).json(categorizedEvents);

    } catch (error) {
        if (!res.headersSent) { 
            res.status(500).json({ message: error.message });
        }
    }
};








