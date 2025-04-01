const BookingServices=require('../Services/BookingsSevices')


 
exports.bookAnEventForUser = async (req, res) => {
    try {
        const booking =await BookingServices.createanUserBooking(req,res);
        res.status(200).json(booking);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};

exports.rejectthebooking = async (req, res) => {
    try {
        const booking = await BookingServices.rejectBooking(req,res);
        res.status(200).json(booking);
    }
    catch(error){
        res.status(500).json({message: error.message});
    }
};
exports.getBookingsSpecificToUser = async (req, res) => {
    try {
        const bookings = await BookingServices.getBookingsSpecificToUser(req,res);
    }
    catch(error){
        console.error("Error occurred while getting bookings specific to user:", error);
       
    }
}