const User = require('../models/userModel');
const bcrypt=require('bcrypt');

const securePassword=async(password)=>{
    try{
        const passwordHash=await bcrypt.hash(password,10);
        return passwordHash;
    }catch(error){
        res.send(error.message);
    }
}

const loadRegister=async(req,res)=>{
    try{
        res.render('registration');
    }catch(error){
        console.log(error.message);
    }
}
const insertUser=async(req,res)=>{
    try{
        const spassword=await securePassword(req.body.password);
        const user=new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mobileno,
            image:req.file.filename,
            password:spassword,
            is_admin:0

        });
        const userData=await user.save();
        if(userData){
            res.render('registration',{message:"your registration has been successfully."});

        }else{
            res.render('registration',{message:"your registration has been failed"});
        }
        


    }catch(error){
        console.log(error.message);
    }
}

//login
const loginLoad=async(req,res)=>{
    try{
        res.render('login');
    }catch(error){
        console.log(error.message);
    }
}



const verifyLogin = async (req, res) => {
    try {
      const email = req.body.email;
      const password = req.body.password;
  
      const userData = await User.findOne({ email: email });
  
      if (userData) {
        const passwordMatch = await bcrypt.compare(password, userData.password);
  
        if (passwordMatch) {
          req.session.user_id = userData._id;
          res.redirect("/");
        } else {
          res.render("login", { message: "Wrong Password" });
        }
      } else {
        res.render("login", { message: "No user found" });
      }
    } catch (error) {
      res.send(error.message);
    }
  };

  
const loadHome=async(req,res)=>{
   try{
    const userData=await User.findById({_id:req.session.user_id});
    
    if(userData){
        res.render('home',{user:userData});
    }else{
        res.render('usernotfound')
    }

    
   } catch(error){
    console.log(error.message);

   }
}

const userLogout=async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/login');
    }catch(error){
        console.log(error.message);
    }
}

//user profile edit and update
const editLoad=async(req,res)=>{
    try{

        const id=req.query.id;
        const userData= await User.findById({_id:id});

        if(userData){
            res.render('edit',{user:userData});
        }else{
            res.redirect('/');
        }

    }catch(error){
        console.log(error.message)
    }
}


const updateProfile=async(req,res)=>{
    try{
        // console.log("yyyyyy");
        // console.log("ghjghj",req.params.userId);

        if(req.file){
            const userData=await User.findByIdAndUpdate({_id:req.params.userId},{ $set:{name:req.body.name,email:req.body.email,mobile:req.body.mobileno,image:req.file.filename} });
                             

        }else{
          const userData=await User.findByIdAndUpdate({_id:req.params.userId},{ $set:{name:req.body.name,email:req.body.email,mobile:req.body.mobileno} });
        }
        res.redirect('/');

    }catch (error){
        console.log(error.message);
    }
}

module.exports={
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    editLoad,
    updateProfile


};
