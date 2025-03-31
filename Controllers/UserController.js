const userServices=require('../Services/UserServices');


exports.registernewUser = async (req, res) => {
    try{
        const user=await userServices.registernewUser(req,res);
        res.status(200).json(user);

    }
    catch(error){
        console.log("Error in registering new user");
    }
}
exports.loginUser = async (req, res) => {
    try{
        const user=await userServices.loginExisitngUser(req,res);
        res.status(200).json(user);

    }
    catch(error){
        console.log("Error login user");

    }


}
exports.UpdateExisitngUser=async(req,res)=>{
    try{
        const user=await userServices.UpdateExistingUser(req,res);
        console.log("Updated User Successfully");
    }
    catch(error){
        console.log(error);
    }
}
exports.getEventsforUser = async (req, res) => {
    try{
        const user=await userServices.getEventsforUser(req,res);
        res.status(200).json(user.events);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}
exports.addEventToUser = async (req, res) => {
    try{
        const user=await userServices.addEventToUser(req,res);
        res.status(200).json(user.events);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}

exports.logoutAUser=async(req,res)=>{
    try{
        const user=await userServices.logouttheUser(req,res);
        res.status(200).json(user);
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}

exports.UpdateEmailOrPasswordorBothOfUser = async (req, res) => {
    try {
        const user = await userServices.UpdateEmailOrPasswordorBothOfUser(req); 
        res.status(200).json({
            message: "User Updated Successfully",
            user: user,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getDetailsOfUser=async(req,res)=>{
    try{
        const user=await userServices.getUserDetails(req,res);
        console.log("User Details Fetched Successfully");
    }
    catch(error){
        res.status(500).json({message:error.message});
    }
}