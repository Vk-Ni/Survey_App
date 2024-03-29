const express = require("express");
const router = express.Router();
const userController = require("../controllers/users");

router.get(["/","/login"],(req,res)=>{
    
    res.render("login");
});

router.get("/register",(req,res)=>{
    
    res.render("register");
});

router.get("/profile",userController.isLoggedIn,(req,res)=>{
    if(req.user){
        res.render("profile",{user:req.user});
    }else{
        res.redirect("/login");
    }
    
    
});



router.get("/home",userController.isLoggedIn, (req,res)=>{
    if(req.user){
        res.render("home",{user:req.user});
    }
    else{
        res.redirect("/login");
    }

});

router.get("/newsurvey",userController.isLoggedIn,(req,res)=>{
    if(req.user){
        res.render("newsurvey",{user:req.user});}
    else{
        res.redirect("/login");
    }
});

router.get("/response",userController.isLoggedIn,(req,res)=>{
    
    if(req.user){
        res.render("response",{user:req.user});}
    else{
        res.redirect("/login");
    }
});

router.get("/user",userController.isLoggedIn,(req,res)=>{
    
    if(req.user){
        res.render("user",{user:req.user});
    }
    else{
        res.redirect("/login");
    };
});

router.get("/userprofile",userController.isLoggedIn,(req,res)=>{
    
    if(req.user){
        res.render("userprofile",{user:req.user});
    }
    else{
        res.redirect("/login");
    };
});




module.exports=router;
