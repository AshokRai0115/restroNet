const { Router } = require("express")
const handleError = require("../utils/handleError")

const cuisineController = require('../controllers/cuisineController1')

const router = Router()

router.get('/cuisine', cuisineController.all_cuisine)
router.get("/cuisine/:id", cuisineController.get_single_cuisine)
router.post('/cuisine', cuisineController.create_cuisine)
router.put("/cuisine/:id", cuisineController.update_cuisine);
router.delete("/cuisine/:id", cuisineController.delete_cuisine);
 
module.exports = router;