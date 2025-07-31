const { Router } = require("express")
const upload = require("../middlewares/upload")

const venueController = require('../controllers/venueController')

const router = Router()


router.get('/venue', venueController.all_venue)
router.post('/venue',upload.single("logo"), venueController.create_venue)
router.put("/venue/:id", venueController.update_venue)
 
module.exports = router;