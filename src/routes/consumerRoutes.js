
const {Router} = require("express");
const ConsumerController = require("../controllers/consumerController")
const router = Router()

router.post("/consumer/signup", ConsumerController.signUp)
router.post("/consumer/login", ConsumerController.loginUser)
// router.get("/consumer/all", ConsumerController.allUser)

module.exports = router