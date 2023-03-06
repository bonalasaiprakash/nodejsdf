const express = require("express")
const router = express.Router()
const {registerUser,loginrUser,currentUserInfo} = require("../controllers/userController")
const validateToken = require("../middleware/validateTokenHandler")

router.post("/register",registerUser)

router.post("/login", loginrUser)

router.get("/currentUser", validateToken, currentUserInfo)

module.exports = router