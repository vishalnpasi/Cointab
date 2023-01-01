const express = require('express')
const userController = require('../controllers/userController')
const rout = express();
const body_Parser = require('body-parser')
const path = require('path')

// rout.use(body_Parser.json())
rout.use(body_Parser.urlencoded({extended:true}));

// login...
rout.get("/login.html", function (req, res) {
    res.sendFile(path.join(__dirname, '../views','login.html'));
});  
rout.post('/login.html',userController.login)

// signUp
rout.get("/signup.html", function (req, res) { 
    res.sendFile(path.join(__dirname ,'../views' , '/signup.html'));
});  
rout.post('/signup.html',userController.register)

// home 
rout.get('/home.html', function (req, res) {
    res.sendFile(path.join(__dirname,'../views','home.html'))
  });

//=================================[ Default Params] ====================================
rout.all(function(req,res){
    return res.status(400).send({status:false,massage:"invalid Params"})
})
module.exports = rout