const { Router } = require("express")
const upload = require("../middlewares/upload")
const handleError = require("../utils/handleError")

const categoryController = require('../controllers/categoryController')

const router = Router()


router.get('/category', categoryController.all_category)
router.get("/category/:id", categoryController.get_single_category)
router.post('/category',upload.single("icon"), categoryController.create_category)
router.put("/category/:id",upload.single("icon"), categoryController.update_category);
router.delete("/category/:id", categoryController.delete_category);
 
module.exports = router;