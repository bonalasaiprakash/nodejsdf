const asyncHandler = require("express-async-handler")
const User = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

//@desc User Registration functionality
//@route /api/user/register
//@access public
const registerUser = asyncHandler(async (req,res)=>{
    const {username,email,password} = req.body;
    if(!username || !email || !password){
        res.status(400)
        throw new Error("Fill all the required fields.")
    }

    const userMail = await User.findOne({email})
    if(userMail){
        res.status(400)
        throw new Error("This Email Address is already registered with us.")
    }

    //Hashing user Password
    const hashedPass = await bcrypt.hash(password,10)
    // console.log("Hashed Password: ",hashedPass) //printing password to check hashed output

    const newUser = await User.create({
        username,
        email,
        password: hashedPass
    })

    console.log(`User Registration was successful ${newUser}`)
    if(newUser){
        res.status(201)
        res.json({response:"Hola! Your REGISTER route is working ideally.",newUserDetails:newUser})
    }else{
        res.status(400)
        throw new Error("Data Validatio n Alert. Your Registration Data Is Not Valid.")
        // res.json({response:"Data Validatio n Alert. Your Registration Data Is Not Valid.",newUserDetails:newUser})
    }
})


//@desc User Login functionality
//@route /api/user/login
//@access public
const loginrUser = asyncHandler(async (req,res)=>{
    const  {email, password} = req.body
    if(!email || !password){
        res.status(400)
        throw new Error("All fields are mandatory!")
    }

    const userDetail = await User.findOne({email})
    if(userDetail && (await bcrypt.compare(password, userDetail.password))){
        const accessToken = jwt.sign({userInfo:{
            username:userDetail.username,
            email:userDetail.email,
            id:userDetail.id
        }
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:"10m"})
        res.status(200).json({jwtAccessToken:accessToken})
    }else{
        res.status(401)
        throw new Error("This Email Address OR Password is incorrect. Please check the details you entered.")
    }
    // res.json({response:"Hola! Your LOGIN route is working as exprected."})
})

//@desc Current Logged In User functionality
//@route /api/user/currentUser
//@access private
const currentUserInfo = asyncHandler(async (req,res)=>{
    res.json({response:"Hola! Your CURRENT_USER route is working fine.",loggedInUserDetails:req.user})
})

module.exports = {registerUser,loginrUser,currentUserInfo}