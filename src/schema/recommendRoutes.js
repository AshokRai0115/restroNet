const { Router } = require("express")
const {recommendRestaurants} = require("./recommendRestaurants")



const router = Router()

router.get("/recommendDemo", async (req, res) => {
  const { userId, lat, lon } = req.query;

  if (!userId || !lat || !lon) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  const restaurants = await recommendRestaurants(userId, parseFloat(lat), parseFloat(lon));

  res.json({
    success: true,
    count: restaurants.length,
    data: restaurants
  });
});

module.exports = router;
