const mongoose=require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/user_management_system");

const express=require("express");
const app=express();



const nocache=require("nocache");
app.use("/",nocache());
const path=require("path");

app.use("/static",express.static(path.join(__dirname,"public")));

//for user routes
const userRoute=require('./routes/userRoute');
app.use('/',userRoute);
// const User = require('./models/userModel');


 //for admin routes
 const adminRoute=require('./routes/adminRoute');
  app.use('/admin',adminRoute);


 
app.listen(2000,()=>{
    console.log("server is running at http://localhost:2000")
});