const mysql = require('mysql');

const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"cointab"
})

con.connect(function(err) {
    if (err) throw err;
    else return console.log("MySQL Connected Successfull....");
});

// Creating User Table if it doesn't Exist............
let userTable = `create table userTable(id int NOT NULL AUTO_INCREMENT PRIMARY KEY , name varchar(100),email varchar(100),
password varchar(100) , failed_attempt int default 0 , last_failed_attempt timestamp);`
con.query(userTable, function (err, result) {
      if (err) console.log("User Table Already Present")
      else console.log("User Table created");
});

module.exports = con