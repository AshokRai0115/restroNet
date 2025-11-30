const { Router } = require("express")
const upload = require("../middlewares/upload")
const handleError = require("../utils/handleError")

const tagController = require('../controllers/tagController')

const router = Router()

router.get('/tag', tagController.all_tag)
router.get("/tag/:id", tagController.get_single_tag)
router.post('/tag', tagController.create_tag)
router.put("/tag/:id", tagController.update_tag);
router.delete("/tag/:id", tagController.delete_tag);
 
module.exports = router;