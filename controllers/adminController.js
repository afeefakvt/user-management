// const { connect, mongo } = require("mongoose");
const User=require("../models/userModel");
const bcrypt=require('bcrypt');
// const  verifyLogin  = require("./userController");

const securePassword = async (password) => {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      return passwordHash;
    } catch (error) {
      res.send(error.message);
    }
  };

const loadLogin=async(req,res)=>{
    try{
        res.render('login');

    }catch(error){
        console.log(error.message);
    }
}

const verifyLogin=async(req,res)=>{
    try{

        const email=req.body.email;
        const password=req.body.password;

        console.log(email, password, "hii")

        const userData=await User.findOne({email:email});
        if(userData){
            console.log(userData)
           
            if(userData.is_admin===1){
             const passwordMatch = await bcrypt.compare(password,userData.password);
             if(passwordMatch){
                req.session.admin_id=userData._id;
            
                res.redirect("/admin/home");
            

            }else{
               
                       res.render('login',{message:"wrong password"});
            }


           }else{
            res.render('login',{message:"no user found"});
        }

        }else{
            res.render('login',{message:"no user found"});
        }

    }catch(error){
        console.log(error.message);

    }
}


  
const loadDashboard= async(req,res)=>{

    try{
       
        
       
        const userData=await User.findById({_id:req.session.admin_id})
        res.render('home',{admin:userData});
    }catch(error){
        console.log(error.message);
    }
}
const logout=async(req,res)=>{
    try{
        req.session.destroy();
        res.redirect('/admin');

    }catch(error){
        console.log(error.message);
       }
 }


const adminDashboard=async(req,res)=>{
    try{
        const searchQuery = req.query.search
         
         const usersData=await User.find({is_admin:0});

         if(searchQuery){
            
         const filteredData=usersData.filter((data)=>
         data.name.toLowerCase().includes(searchQuery)
     
     );
     res.render('dashboard',{users:filteredData, srchVal: searchQuery});

         }else{

           res.render('dashboard',{users:usersData, srchVal: null});

         }


    }catch(error){
        console.log(error.message);
    }

}

// const adminDashboard = async (req, res) => {
//     try {
//       let search = "";
//       if (req.query.search) {
//         search = req.query.search;
//       }
  
//       const usersData = await User.find({
//         is_admin: 0,
//         $or: [
//           { name: { $regex: ".*" + search + ".*", $options: "i" } },
//           { email: { $regex: ".*" + search + ".*", $options: "i" } },
//         ],
//       });
  
//       res.render("dashboard", { users: usersData });
//     } catch (error) {
//       res.send(error.message);
//     }
//   };


//add new work start
const newUserLoad=async(req,res)=>{
    try{
        res.render('new-user');

    }catch(error){
        console.log(error.message);
    }
}

const addUser=async(req,res)=>{
    try{
        const name=req.body.name;
        const email=req.body.email;
        const mobileno=req.body.mobileno;
        const image=req.file.filename;
        const password=req.body.password;

        const spassword= await securePassword(password);

        const user=new User({
            name:name,
            email:email,
            mobile:mobileno,
            image:image,
            password:spassword,
            is_admin:0

        });
        const userData = await user.save();
        if (userData) {
            res.redirect("/admin/dashboard");
          } else {
            res.render("new-user", { message: "Something went Wrong" });
          }
        } catch (error) {
          res.send(error.message);
        }
      };

//edit user functionality
const editUserLoad=async(req,res)=>{
    try{
        const id=req.query.id;
        const userData=await User.findById({_id:id});
        if(userData){
        res.render('edit_user',{user:userData});
        }
        else{
            res.redirect('/admin/dashboard');
        }


    }catch(error){
        console.log(error.message);
    }
}
  
const updateUser=async(req,res)=>{
      try{
       const userData=await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mobileno}})
        
       res.redirect('/admin/dashboard');
      }catch(error){
        console.log(error.message);
      }
}
//deleteuser
const deleteUser=async(req,res)=>{
    try{
        const id=req.query.id;
        await User.deleteOne({_id:id});
        res.redirect('/admin/dashboard');

    }catch(error){
        console.log(error.message)
    }
}
module.exports={
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUser,
    deleteUser

}
