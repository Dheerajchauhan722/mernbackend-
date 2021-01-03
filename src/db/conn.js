const mongoose=require("mongoose");

mongoose.connect('mongodb://localhost:27017/'+process.env.DB_NAME,
{
     useNewUrlParser: true,  // to avoid deprication warnings
     useUnifiedTopology: true ,
     useCreateIndex:true,
     useFindAndModify:false
}).then(()=>console.log("connection successfull....")).catch((err)=>console.log("No connection"));
    