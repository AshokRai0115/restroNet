const { Router } = require("express")
const upload = require("../middlewares/upload")


const venueController = require('../controllers/venueController')

const router = Router()

const uploadFields = upload.fields([
    { name: 'logo', maxCount: 1 }, 
    { name: 'images', maxCount: 10 } 
]);

router.get('/venue', venueController.all_venue)
router.post('/venue',uploadFields, venueController.create_venue)
router.put("/venue/:id", venueController.update_venue)
 
module.exports = router;