const app=require('express');
const router=app.Router();
const UserController=require('../Controllers/UserController');
const middlewareAuth=require('../Middlewares/UserAuthenticationMiddleware');


//user routes in the application


//Route for registering a new user in cnnct (our application)
router.post('/signup',UserController.registernewUser);

//Route for updating a exisiting user in cnnct (our application)

router.put('/update/:id',middlewareAuth,UserController.UpdateExisitngUser);

 router.get('/getUserDetails/:id',middlewareAuth,UserController.getDetailsOfUser);
//Route for login a exisiting user in cnnct (our application)
router.post('/login',UserController.loginUser);

//Route for logout a user in cnnct (our application)
router.post('/logout',middlewareAuth,UserController.logoutAUser);

//Routes for Users updating email or passowrd or both in cnnct (our application)
router.put('/updateemailpassowrdorboth/:id',middlewareAuth,UserController.UpdateEmailOrPasswordorBothOfUser);






module.exports=router;
