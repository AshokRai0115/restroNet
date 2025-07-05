
const {Router} = require("express");
const UserController = require("../controllers/userController")
const router = Router()

router.post("/user/signup", UserController.signUp)
router.get("/user/all", UserController.allUser)

module.exports = router