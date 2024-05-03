const express=require("express");
const admin_route=express();

const session=require("express-session");
const config=require("../config/config");
admin_route.use(session({
    secret:config.sessionSecret,
    resave:false,
    saveUninitialized:false}));

admin_route.use(express.json());
admin_route.use(express.urlencoded({extended:true}));


admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');

const multer=require("multer");
const path=require("path")

admin_route.use(express.static('public'));

const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,path.join(__dirname,'../public/userImages'));
    },
    filename:function(req,file,cb){
        const name=Date.now()+'-'+file.originalname;
        cb(null,name);

    }
});
const upload=multer({storage:storage})

const auth=require("../middleware/adminAuth");

const adminController=require("../controllers/adminController");

admin_route.get('/',auth.isLogout,adminController.loadLogin);

admin_route.post('/',adminController.verifyLogin);

admin_route.get('/home',auth.isLogin,  adminController.loadDashboard);

admin_route.get('/logout',auth.isLogin,adminController.logout);

admin_route.get('/dashboard',auth.isLogin,adminController.adminDashboard);

admin_route.get('/new-user',auth.isLogin,adminController.newUserLoad);

 admin_route.post('/new-user',upload.single('image'),adminController.addUser);

admin_route.get('/edit_user',auth.isLogin,adminController.editUserLoad);

admin_route.post('/edit_user',adminController.updateUser);

admin_route.get('/delete_user',adminController.deleteUser);

admin_route.get('*',(req,res)=>{
     

    res.redirect('/admin');
})
admin_route.post('/adduser',upload.single('image'),adminController.addUser);

module.exports=admin_route;