const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema
const EventsSchema = new Schema({
    EventTopic: String,
    password: String,
    Hostname: {
      type: String,
      ref: 'User',
      required: [true, 'Hostname is required!']
    },
    description: String,
      date: Date,
     time: String,
     durationmeriadian:{
        type: String,
        enum: ['AM', 'PM']
     },
     banner: {
       
        backgroundColour: {
          type: String,
          required: [true, 'Background colour is mandatory and required each meeting must have a background colour!'],
        },
       

     },
     link: {
        type: String,
        required: [true, 'Link is mandatory and required each meeting must have at least a link!'],
     },
     timezone: {
         type: String,
         required: [true, 'Timezone is required!'],
     },
      duration: String,
      startTime:{
        type:String,

      },
      endTime:{
        type:String,
      },
      Eventtype:{
        type: String,
        enum: ['Conference', 'Meeting', 'Program','Appointment','Seminar','Workshop','Webinar']

      },


    attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    
    isActive: {
        type: Boolean,
        default: true
    }
});

// Create a model
const Event=mongoose.model('Events', EventsSchema);
module.exports=Event;