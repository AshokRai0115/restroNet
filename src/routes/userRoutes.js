
const {Router} = require("express");
const UserController = require("../controllers/userController")
const router = Router()

router.post("/user/signup", UserController.signUp)

module.exports = router