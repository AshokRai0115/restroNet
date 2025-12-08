const UserPreference = require("./userPreferenceSchema")
const Venue = require("../models/venueModel")
const recommendRestaurants = async (userId, userLat, userLon) => {

  const preference = await UserPreference.findOne({ userId });
  const maxDistance = preference?.maxDistance || 5000;

  // 1. Get restaurants in radius
  const venues = await Venue.find({
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [userLon, userLat] },
        $maxDistance: maxDistance,
      }
    }
  });

  const results = venues.map(venue => {
    let score = 0;

    // 2. Cuisine match
    if (preference?.preferredCuisines?.some(c => venue.cuisine.includes(c))) {
      score += 20;
    }

    // 3. Price match
    if (preference?.preferredPriceRange === venue.priceRange) {
      score += 15;
    }

    // 4. Diet match
    if (preference?.dietary?.isVeg && venue.isVeg) score += 10;
    if (preference?.dietary?.isVegan && venue.isVegan) score += 10;
    if (preference?.dietary?.isHalal && venue.isHalal) score += 10;

    // 5. Ambience match
    if (preference?.preferredAmbience?.includes(venue.ambience)) {
      score += 10;
    }

    // 6. Rating power
    score += venue.avgRating * 2;

    // 7. Popular + Trending
    score += (venue.popularityScore * 1.5);
    score += (venue.trendingScore * 2);

    // 8. Engagement
    score += (venue.favorites * 0.5);
    score += (venue.checkIns * 0.5);

    // 9. Penalize very crowded
    if (venue.crowdLevel === "very-high") score -= 10;

    return {
      ...venue._doc,
      recommendationScore: score
    };
  });

  results.sort((a, b) => b.recommendationScore - a.recommendationScore);

  return results;
};

module.exports = {recommendRestaurants}
