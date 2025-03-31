const port=9000
const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());

const mongoose = require('mongoose');
const UserRoutes = require('./Routes/UserRoutes');
const EventRoutes = require('./Routes/EventRoutes');
const BookingRoutes=require('./Routes/BookingRoutes')
const UserAvailabilityTimeSlotRoutes=require('./Routes/UserAvailabiltyTimeSlotRoutes')
const {configDotenv}=require('dotenv')
configDotenv();
// Load environment variables

app.use(cors(
    {
        origin: 'https://cnnct-frontend-sam.vercel.app/',
        methods: 'GET,POST,PUT,DELETE',
        credentials: true
    }
));
//redirection to sepicified routes
app.get("/", (req, res) => {
    res.send("Server is running!");
});
//redirection to sepicified routes
app.use('/user',UserRoutes);
app.use('/user/events',EventRoutes)
app.use('/user/bookings',BookingRoutes)
app.use('/user/timeslotavailabilty',UserAvailabilityTimeSlotRoutes)


mongoose.connect(process.env.MONGO_URl)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Failed to connect to MongoDB', err));
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});
