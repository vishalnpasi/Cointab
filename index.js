const express = require('express')
const body_Parser = require('body-parser')
require('dotenv').config()
const app = express();
const router = require("./router")

app.use(body_Parser.json())

app.use('/',router)

let PORT = (process.env.PORT || 3000)
app.listen(PORT,function(){
    console.log("App Running on Port:",PORT)
})
