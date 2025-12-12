const { Router } = require("express")
const upload = require("../middlewares/upload")
const handleError = require("../utils/handleError")

const recommendationController = require('../controllers/recommendationController')

const router = Router()


router.get('/recommendations', recommendationController.getRecommendedRestaurants)
// router.get("/recommendation/:id", recommendationController.get_single_menu)
// router.get("/recommendation/restaurant/:id", upload.none(), recommendationController.get_menu_by_restaurant);
// router.post('/recommendation', upload.none(), recommendationController.create_menu)
// router.put("/recommendation/:id", upload.none(), recommendationController.update_menu);
// router.delete("/recommendation/:id", recommendationController.delete_menu);
 
module.exports = router;