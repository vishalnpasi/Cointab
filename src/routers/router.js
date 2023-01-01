const express = require('express')
const userController = require('../controllers/userController')
const rout = express();
const body_Parser = require('body-parser')
const path = require('path')

// rout.use(body_Parser.json())
rout.use(body_Parser.urlencoded({extended:true}));

// login...
rout.get("/login", function (req, res) {
    res.sendFile(path.join(__dirname, '../views','login.html'));
});  
rout.post('/login',userController.login)

// signUp
rout.get("/signup", function (req, res) { 
    res.sendFile(path.join(__dirname ,'../views' , '/signup.html'));
});  
rout.post('/signup',userController.register)

// home 
rout.get('/home', function (req, res) {
    res.sendFile(path.join(__dirname,'../views','home.html'))
  });

//=================================[ Default Params] ====================================
rout.all(function(req,res){
    return res.status(400).send({status:false,massage:"invalid Params"})
})
module.exports = rout