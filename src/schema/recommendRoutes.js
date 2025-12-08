const { Router } = require("express")
const {recommendRestaurants} = require("./recommendRestaurants")



const router = Router()

router.get("/recommend", async (req, res) => {
  const { userId, lat, lng } = req.query;

  if (!userId || !lat || !lng) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  const restaurants = await recommendRestaurants(userId, parseFloat(lat), parseFloat(lng));

  res.json({
    success: true,
    count: restaurants.length,
    data: restaurants
  });
});

module.exports = router;
