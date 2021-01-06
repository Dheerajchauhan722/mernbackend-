// we cannot use this in fat arrow function ()=>{}
// here this is working as registerEmployee which is in app.js
const mongoose=require("mongoose");

const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const employeeSchema=new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    gender:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true

    },
    age:{
        type:Number,
        require:true

    },
    password:{
        type:String,
        require:true
    },
    confirmpassword:{
        type:String,
        require:true
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }]

})

//generating tokens and including tokens in database before the save() of register data
employeeSchema.methods.generateAuthToken=async function(){ /// methods() used because we call it using registerEmployee in app.js which is document(instance method) .for collection we use static
    try{
        // using this._id we can get data from form which we just register ot login
        const token_result=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);  //we fetching secrete_key from.env and format to fetch any value from key-value in env is by using process.env.key_name
        this.tokens=this.tokens.concat({token:token_result}); //we are just giving the inner token the value of token_result
        await this.save(); // to save tokens in database
        return token_result;
    }catch(e){
        res.Send(e);
        console.log(e);
    }
}

// converting password into hash(encryption)
employeeSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password,10);
        this.confirmpassword=undefined;  // undefined columns are not stored in database so no confirmpassword will be saved
    }
    next();
})

//now we need o create the collection
const  Register=new mongoose.model("Register",employeeSchema);
module.exports=Register;

