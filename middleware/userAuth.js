require("dotenv").config();
const jwt = require("jsonwebtoken");


const secret = process.env.JWT_SECRET

async function userAuth(req,res,next) {
    
    const token = req.cookies.token;
    try{

        if(!token){
            console.log("Unauthorized user");
            return res.redirect("/login");
        }

        const decoded = jwt.verify(token, secret);
        req.user = decoded.user;

        next()
        
    }catch(error){
         console.log(error)
        res.status(500).render("client/server-error",{
            message: error.message
           
        })
    }
}

module.exports = userAuth;

