const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defining my db schema
const UserreferencesSchema = new Schema({
     
    user_id: { type: Schema.Types.ObjectId, ref: 'User' },
    Userpreferences: {
        type:[String],
        enum: ['Sales', 'Education', 'Finance', 'Government & Politics', 'Consulting','Recruiting','Tech','Marketing'],
        required: true,
    },
});

// Create the model
const UserPreferences=mongoose.model('UserPreferences', UserreferencesSchema);
module.exports = UserPreferences;