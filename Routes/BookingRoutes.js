const app=require('express');
const router=app.Router();


const BookingController=require('../Controllers/BookingController');
const middlewareAuth=require('../Middlewares/UserAuthenticationMiddleware');
const CheckAvailabilityConfilctMiddleware=require('../Middlewares/CheckAvailabilityConfilctMiddleware');

//booking an event  routes in the application
router.post('/bookanevent/:id',middlewareAuth,CheckAvailabilityConfilctMiddleware,BookingController.bookAnEventForUser);

//getting the  bookings specific to a user  routes in the application

router.get('/getbookings/:id',middlewareAuth,BookingController.getBookingsSpecificToUser)



//Here middalwareAuth and CheckAvailabilityConfilctMiddleware are the middlewares which are used to authenticate the user and check the availability of the event respectively.

module.exports=router;

