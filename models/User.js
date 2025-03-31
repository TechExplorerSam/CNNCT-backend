const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// Define the database schema
const UsersSchema = new Schema({
    firstName: String,
    lastName: String,
    username:{
        type: String,
        required: [true, 'Username is required!'],
        unique: true


    },
    email: {
        type: String,
        required: [true, 'Email is required!'],
        
        unique: true
    },
    password: {
        type: String,
        validate: {
            validator: function (v) {
                return v.length > 6;
            },
            message: props => `${props.value} must be at least 6 characters!`
        },
        required: [true, 'Password is required!'],
    },
    confirmPassword: {
        type: String,
        validate: {
            validator: function (v) {
                return this.password === v;
            },
            message: props => `${props.value} confirm password must match the password!`
        
        },
    },
    preferences: {
        ref: 'UserPreferences',
        type: Array,
        default: [],
        validate: {
            validator: (v) => v.length > 0, 
            message: 'At least one preference is required!'
            }
    },
    AvailabilityForMeetings: {
         ref:'UserAvailabilityTimeSlot',
       type: mongoose.Schema.Types.ObjectId,
       

     },
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
});
const User = mongoose.model('User', UsersSchema);
module.exports = User;