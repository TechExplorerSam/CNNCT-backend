const {configDotenv}=require('dotenv')
configDotenv();
const jwt=require('jsonwebtoken');

 const UserVerificationAuthenticationMiddleware=(req,res,next)=>{
    const token = req.header("Authorization")?.split(" ")[1];
    if(!token){
        return res.status(401).json("Your Token is missing ,hence you are not authorized ");
    }
    else{
        try{
            
            const verficationOfToken=jwt.verify(token,process.env.JWT_SECRET_KEY);
            console.log("Token Verified Sucessfully");
            req.user=verficationOfToken;
            next();
        }
        catch(error){
            return res.status(403).json("Invalid User Token");
        }
    }
}
module.exports=UserVerificationAuthenticationMiddleware;

