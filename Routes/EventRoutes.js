const app=require('express');
const router=app.Router();

const EventController=require('../Controllers/EventsController');
const middlewareAuth=require('../Middlewares/UserAuthenticationMiddleware');
const CheckAvailabilityConfilctMiddleware=require('../Middlewares/CheckAvailabilityConfilctMiddleware');

//event routes in the application cnnct (our application)

//Route for creating a new event in cnnct (our application)
router.post('/createanevent',middlewareAuth,CheckAvailabilityConfilctMiddleware,EventController.createAnEvent);

//Route for getting all events specific to a user in cnnct (our application)
router.get('/getanevent/:hostname',middlewareAuth,CheckAvailabilityConfilctMiddleware,EventController.getSpecificUserEvents);

//Route for getting all events in a specific time range in cnnct (our application)
router.get('/geteventsintimeerange',middlewareAuth,CheckAvailabilityConfilctMiddleware,EventController.getEventsInRange);

//Route for getting all events participants in cnnct (our application)
router.get('/geteventparticipants/:Bookingname',middlewareAuth,CheckAvailabilityConfilctMiddleware,EventController.getEventParticipants);

//Route for updating an event in cnnct (our application)
router.put('/updateanevent/:id',middlewareAuth,CheckAvailabilityConfilctMiddleware,EventController.updateAnEvent);

//Route for deleting an event in cnnct (our application)
router.delete('/deleteanevent/:id',middlewareAuth,EventController.deleteanevent);

//Route for updating the running status of an event in cnnct (our application)
router.put('/updateeventrunningstatus/:id',middlewareAuth,EventController.UpdateRunningStatusOfanEvent);



module.exports=router;



//Here middalwareAuth and CheckAvailabilityConfilctMiddleware are the middlewares which are used to authenticate the user and check the availability of the event respectively.

