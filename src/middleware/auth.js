// cookies hold the last system user info and assumes that still login

const jwt=require("jsonwebtoken");

const Register=require("../models/registers"); // requiring collection object

const auth=async (req,res,next)=>{
    try{
        const token=req.cookies.jwt; // we fetch this token from cookies
        // if verifyUser is invalid then catch is called otherwise we go to render secrete in app.js
        const verifyUser=jwt.verify(token,process.env.SECRET_KEY); // we can only verify user by secreate key because secrete key also there in token
        console.log(verifyUser); // if user verifies then we get id and iat
        
        // we can also print user data after valid varification
        const user=await Register.findOne({_id:verifyUser._id});
        console.log(user.firstname);

        req.token=token;
        req.user=user;  // to access req.user in app.js
        
        next();
    }catch(e){
        res.status(401).send(e);
    }
}
module.exports =auth;

