const app=require('express');
const router=app.Router();


const UserAvailabilityController=require('../Controllers/UserAvailabilityTimeSlotsController');
const middlewareAuth=require('../Middlewares/UserAuthenticationMiddleware');
const CheckAvailabilityConfilctMiddleware=require('../Middlewares/CheckAvailabilityConfilctMiddleware');

//user availability routes in the application cnnct (our application)

//Route for creating a new user availability time slot in cnnct (our application)
router.post('/createuseravailabilitytimeslot/:id',middlewareAuth,CheckAvailabilityConfilctMiddleware,UserAvailabilityController.createUserAvailabilityTimeSlot);

//Route for updating a exisiting user availability time slot in cnnct (our application)
router.put('/updateuseravailabilitytimeslot/:id',middlewareAuth,CheckAvailabilityConfilctMiddleware,UserAvailabilityController.updateUserAvailabilityTimeSlot);

//Route for deleting a user availability time slot in cnnct (our application)
router.delete('/deleteuseravailabilitytimeslot/:id',middlewareAuth,UserAvailabilityController.deleteUserAvailabilityTimeSlot);

//Route for getting user availability time slots in cnnct (our application)
router.get('/getuseravailabilitytimeslot/:id',middlewareAuth,UserAvailabilityController.getUserAvailabilityTimeSlot);

module.exports=router;