const mongoose = require('mongoose')

const isValidBody = function(body){
    return Object.keys(body).length>0
}
const isValidName = function(name){
    if(!name || typeof name == 'undefined' || name.trim()==0 || typeof name!='string')
        return false
    return true
}
const isValidPhone = function(phone){
    return /^[6-9]\d{9}$/.test(phone)
}
const isValidEmail = function(email){
    // console.log(email,/^[a-z0-9]+[@][a-z]+\.[a-z]{2,3}$/.test(email))
    return /^[a-z0-9]+[@][a-z]+\.[a-z]{2,3}$/.test(email)
}
const isValidPassword = function(password){
    return /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/.test(password)
}
module.exports = {isValidBody,isValidName,isValidPhone,isValidEmail,isValidPassword}