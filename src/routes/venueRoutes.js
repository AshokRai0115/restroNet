const { Router } = require("express")

const venueController = require('../controllers/venueController')

const router = Router()


router.get('/venue', venueController.all_venue)
router.post('/venue', venueController.create_venue)
router.put("/venue/:id", venueController.update_venue)
 
module.exports = router;