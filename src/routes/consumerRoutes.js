
const {Router} = require("express");
const multer = require('multer');
const ConsumerController = require("../controllers/consumerController")
const router = Router()
const upload = multer();

router.post("/consumer/signup", upload.none(), ConsumerController.signUp)
router.post("/consumer/login", upload.none(), ConsumerController.loginUser)
// router.get("/consumer/all", ConsumerController.allUser)

module.exports = router