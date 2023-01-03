const express = require('express')
const userController = require('./userController')
const rout = express();
const body_Parser = require('body-parser')
const path = require('path')

// rout.use(body_Parser.json())
rout.use(body_Parser.urlencoded({extended:true}));

// login...
rout.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, 'login.html'));
});  
rout.post('/',userController.login)

// signUp
rout.get("/signup", function (req, res) { 
    res.sendFile(path.join(__dirname , '/signup.html'));
});  
rout.post('/signup',userController.register)

// home 
rout.get('/home', function (req, res) {
    res.sendFile(path.join(__dirname,'home.html'))
  });

//=================================[ Default Params] ====================================
rout.all(function(req,res){
    return res.status(400).send({status:false,massage:"invalid Params"})
})
module.exports = rout