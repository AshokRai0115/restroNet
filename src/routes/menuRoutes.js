const { Router } = require("express")
const upload = require("../middlewares/upload")
const handleError = require("../utils/handleError")

const menuController = require('../controllers/menuController')

const router = Router()


router.get('/menu', menuController.all_menu)
router.get("/menu/:id", menuController.get_single_menu)
router.post('/menu', upload.none(), menuController.create_menu)
router.put("/menu/:id", upload.none(), menuController.update_menu);
router.delete("/menu/:id", menuController.delete_menu);
 
module.exports = router;