const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defining a Database schema

const UserAvailabilityTimeSlotSchema=new Schema({
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    UserAvaiabilityday:{
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        required: true,

    },
    UserAvailabilityTimeSlot: {
        type: String,
        required: [true, 'User Availability Time Slot is required!']
    },
    UserAvailabilitydate:{
        type: Date,
        required: [true, 'User Availability Date is required!']
    },
    EventActivityType:{
        type: String,
        enum: ['Conference', 'Meeting', 'Program','Appointment','Seminar','Workshop','Webinar'],

        required: [true, 'Event Activity Type is must and required!']
    },
    TimeZone:{
        type: String,
        required: [true, 'Timezone is required!']
    }


})
// Creating a UserAvailabilityTimeSlot model in mongoose
module.exports= mongoose.model('UserAvailabilityTimeSlot',UserAvailabilityTimeSlotSchema);
