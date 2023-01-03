const valid = require('./validation')
const con = require('./connectMySql');
const bcrypt = require('bcrypt');

const register = async function(req,res){
    try{
        let body = req.body
        if(!valid.isValidBody(body)) return res.status(400).send("<h1>Plz Enter data on request body</h1>")

        let {name,email,password} = body

        if(!valid.isValidName(name)) return res.status(400).send("<h1> Name is Mandatory </h1>")

        if(!valid.isValidEmail(email)) return res.status(400).send("<h1> Plz Enter Valid Email </h1>")

        let emailQuery = 'select * from userTable where email = ?'
        con.query(emailQuery,[email],async function(err,result){
            if(err) return res.status(500).send("<h1> INTERNAL ERROR.....")
            if(result.length>0) return res.status(409).send("<h1> Account is Already Exists </h1>")

            if(!valid.isValidPassword(password))
                return res.status(400).send("<h3>PLZ Enter Valid Password , must contain 1 digit , 1 special char , min 6 and max 16</h3>")
        
            let encryptedPass = await bcrypt.hash(password,10)
            let insertQuery = 'insert into userTable(name,email,password,last_failed_attempt) value(?,?,?,now());'
            con.query(insertQuery,[name,email,encryptedPass],function(err,result){
                if(err) return res.status(500).send("<h1> INTERNAL ERROR.....")   
                return res.send(`<body style="text-align:center;background: linear-gradient(120deg,#2980b9, #8e44ad);">
                                <h1>SignUp Successfull</h1>
                                <form method="get" action="/">
                                <button>Back To Login</button>
                                </form></body>`)
            })
        })
    }
    catch(err){
        return res.status(500).send({status:false,key:'hi',massage:err.massage})
    }
}
const login = async function(req,res){
    try {
        let {email,password} = req.body
        let user = "select * from userTable where email = ?"
        con.query(user,[email] , async function(err,result){
            if(err) return res.status(500).send("<h1> INTERNAL ERROR.....")
            if(result.length ==0) return res.status(400).send("<h1> Account isn't Exists </h1>")
                
            let checkPass = await bcrypt.compare(password , result[0].password)

            let failed_attempt = 5-(result[0].failed_attempt+1)
            let diff = Math.abs(new Date(result[0]['last_failed_attempt']).getTime() - new Date().getTime())
                diff = diff / (60 * 60 * 1000);

            let right_attempt = `<body style="text-align:center;background: linear-gradient(120deg,#2980b9, #8e44ad);">
                                <h1>Welcome To Home Page</h1><h1>${email}</h1>
                                <form method="get" action="/">
                                    <button>Logout</button>
                                </form>
                                </body>`
            let wrong_attempt = `<body style="text-align:center;">
                                <h1>You Entered Wrong Password...You have Only ${failed_attempt} Attempt</h1>
                                <form method="get" action="/"><button>Back</button></form>
                                </body>`
            // today...
            if(diff<24){
                if(result[0]['failed_attempt']>=5)
                return res.status(200)
                            .send(`<body style="text-align:center;">
                                    <h1>You Have Reached Maximum failed Attempt limit Plz try 24 hours later</h1>
                                    <form method="get" action="/"><button>Back</button></form>
                                    </body>`)                
                if(checkPass){
                    let update = 'update userTable set failed_attempt = 0 where email = ?;'
                    con.query(update,[email],function(err,updated){
                        if(err) return res.status(500).send("<h1> INTERNAL ERROR.....")
                        return res.status(200).send(right_attempt)
                    })
                }
                //before 24 hour wrong attempt
                else{
                    let update = 'update userTable set failed_attempt = failed_attempt+1 where email = ?;'
                    con.query(update,[email],function(err,updated){
                        if(err) return res.status(500).send("<h1> INTERNAL ERROR.....")
                        return res.status(400).send(wrong_attempt)
                    })
                }
            }
            // yesterday...
            else{
                // after 24 hour right attempt
                if(checkPass){
                    let updateQuery = 'update userTable set failed_attempt = 0 ,last_failed_attempt = now() where email = ?;'
                    con.query(updateQuery,[email],function(err,updated){
                        if(err) return res.status(500).send("<h1> INTERNAL ERROR.....")
                        return res.status(200).send(right_attempt)
                    })
                }
                // after 24 hours wrong attemp
                else{
                    let update = 'update userTable set failed_attempt = 1,last_failed_attempt = now() where email = ?;'
                    con.query(update,[email],function(err,updated){
                        if(err) return res.status(500).send("<h1> INTERNAL ERROR.....")
                        return res.status(400).send(`<body style="text-align:center;">
                                <h1>You Entered Wrong Password...You have Only 4 Attempt</h1>
                                <form method="get" action="/"><button>Back</button></form>
                                </body>`)
                    })
                }
            }
        })
    } 
    catch (error) {
        return res.status(500).send({status:false,massage:error.massage})
    }
}
module.exports = {register,login}