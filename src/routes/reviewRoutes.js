const { Router } = require("express")
const handleError = require("../utils/handleError")

const reviewController = require('../controllers/reviewController')

const router = Router()

router.get('/review', reviewController.all_review)
router.get("/review/:id", reviewController.get_single_review)
router.get("/venue/:venueId/reviews", reviewController.get_venue_reviews)
router.post('/review', reviewController.create_review)
router.put("/review/:id", reviewController.update_review);
router.delete("/review/:id", reviewController.delete_review);
 
module.exports = router;