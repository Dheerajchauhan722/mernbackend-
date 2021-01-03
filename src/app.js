require('dotenv').config({path:'../.env'});  // dotenv is used to encrypt your secrete key when tokening for user you need to give the proper path
const express=require("express");
const app=express();// app is object to all methods and properties inside the express
const port=process.env.PORT || 3000; // process.env.PORT is used for global host
require("./db/conn");  // making connection with mongodb
const Register=require("./models/registers");
app.use(express.json());
app.use(express.urlencoded({extended:false}));  // to get form data to your post request in app.js file you must add this line

// if you want to render file.html inside public use below 3 lines at will also reder css,js files for sure
const path=require("path"); // modelule in nodejs to fetch paths
const public_static_path=path.join(__dirname,'../public'); // if website holds only html,css,js and bootstrap code then we can do it using public(static way)
app.use(express.static(public_static_path)); // first get request to public folder index.html ( It is mostly used to set up middleware for your application ) if no index.html found then it goes to app get response

// to render desired page on desired get request from views
app.set('view engine','hbs'); //to render hbs files in views folder
const views_path=path.join(__dirname,'../templates/views');
app.set("views",views_path);

// to include some fixed file code anywhere we use these partials
const hbs=require('hbs');
const partial_path=path.join(__dirname,'../templates/partials');
hbs.registerPartials(partial_path);

console.log(process.env.SECRET_KEY);

app.get("/",async(req,res)=>{  
    res.render("index");  // this will render at localhost 3000
})

app.get("/register",async(req,res)=>{
    res.render("register");
}) 
// to hash the password(encryption)
const bcrypt=require("bcrypt");
// create a new user in our data base
app.post("/register",async(req,res)=>{
    try{
        const password=req.body.password;
        const confirmpassword=req.body.confirmpassword;
        if(password===confirmpassword){
            const registerEmployee=new Register({
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                phone:req.body.phone,
                gender:req.body.gender,
                age:req.body.age,
                password:password,
                confirmpassword:confirmpassword
    
            });
            const token=await registerEmployee.generateAuthToken(); // we can call a function using Register instance and can declare it in registers.js => Register is the module registers.js because we export it using name Register 
            // console.log(token);
            const Employee_registered=await registerEmployee.save();
            res.status(201).render("register");
        }else{
            res.send("Passwords are not matching");  
        }
        
    }catch(e){
        res.status(400).send(e);
    }
}) 

app.get("/login",async(req,res)=>{
    res.render("login");
})

//login check
app.post("/login",async(req,res)=>{
    try{
        const login_email=req.body.email;
        const login_password=req.body.password;
        const user_email=await Register.findOne({email:login_email}); // first email is from database 2nd is what user add
        const user_data_password=user_email.password;
        const isMatch=bcrypt.compare(login_password,user_data_password);

        const token=await user_email.generateAuthToken(); // here we can replace registerEmployee with user_email because user_email is also an instance of Regiser()
        if(isMatch){
            res.status(201).render("index");
        }
        else{
            res.send("Invalid login details"); //Password is incorrect
        }
    }catch{
        res.status(400).send("Invalid login details"); //Invalid Email
    }
})

app.get("*",async(req,res)=>{
    res.render("404");
}) 

app.listen(port,()=>{
    console.log(`connection is setup at ${port}`); //template engine ``
})




// bcrypt to hash the password

// const securePassword=async(password)=>{
//     const hash_password=await bcrypt.hash(password,10);
//     console.log(hash_password);
//     const passwordmatch=await bcrypt.compare(password,hash_password);
//     console.log(passwordmatch);
// }

// securePassword("thapa@123");
// 10 rounds for dheeraj   $2b$10$4DNWltK1huDyYaSpkwQIheN9.adJW1KvXafbnZja.pqwMZxvfZELG
//4 rounds    $2b$04$lEG.fhK8.txwc4REEVOLneJm/ksVslH0qKN1uLuS7eqTPgQOptjNy

// JSON WEB TOKEN TO VERIFY LOGED IN USERS (JWS)

// const jwt=require("jsonwebtoken");
// const createToken=async()=>{
//     const token=await jwt.sign({_id:"5fef24b453cdb1096871648c"},"mynameisdheerajchauhanfromgopalgarh",{expiresIn:"2 days"}); //we add 2 params in sign 1. unique user any value(id) 2. secreate key >32char (mynameisdh ....)
//     console.log(token);
    
//     const userVerification=await jwt.verify(token,"mynameisdheerajchauhanfromgopalgarh")
//     console.log(userVerification);
// }
// createToken(); // calling the function







