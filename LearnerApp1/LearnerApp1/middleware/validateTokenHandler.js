const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")


const validateToken = asyncHandler((req,res,next)=>{
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1]
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,decoded)=>{
            if(err){
                res.status(401)
                throw new Error("User is not authorized to access at this time. Either Token expired or Token is Invalid")
            }
            //console.log(decoded)
            req.user = decoded.userInfo;
            console.log(req.user)
            next();
        })

        if(!token){
            res.status(401)
            throw new Error("Either Token expired or Token is Invalid")
        }
    }else{
        res.status(401)
        throw new Error("Validation Token is missing. Try Logging In first, then route with the token.")
    }
})

module.exports = validateToken