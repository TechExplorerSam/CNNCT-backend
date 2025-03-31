const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Defining a schema
const BookingsSchema = new Schema({
    
    Bookingname:{        
        type: String,

       required: [true, 'Booking name is required!']
    },
    Bookingdate: {
        type: Date,
        required: [true, 'Booking date is required!']
    },
   
    BookingCategoryW_R_T_Time:{
        type: String,
        enum:['Upcoming','Pending','Cancelled','Past'],
        required: [true, 'Booking category is required!']


    },
    BookingEventtype:{
        type: String,
        required: [true, 'Booking event type is compulsory and required!']


    },

    BookingStatus:{
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],

    },
    BookingTime: {
        type: String,
        required: [true, 'Booking time is required!']
    },
    BookingTimeDuration: {
        type: String,
        required: [true, 'Booking time duration is required!']
    },
    BookingUser: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    BookingNumberOfPersons: {
        type: Number,
        required: [true, 'Number of persons attending the event/meeting/program are required!']
    },
    BookingTotalCountOfPersons: {
        type: Number,
        required: [true, 'Total count of persons attending the event/meeting/program are required!']
    },

    
});
// Creating a booking model in mongoose
const Booking=mongoose.model('Bookings', BookingsSchema);
module.exports=Booking;