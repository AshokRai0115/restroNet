const Restaurant = require("../models/venueModel"); // Note: Assuming "Venue" model is imported as "Restaurant" here

module.exports.getRecommendedRestaurants = async (req, res, next) => {
    try {
        const {
            cuisines, 
            categories,
            tags,
            radius,
            lat,
            lng,
            sort,
            _search
        } = req.query;
        
        let filterConditions = [];
        
        // ===================================
        // 2. Build individual filter conditions
        // ===================================

        // --- Cuisine Filter (Case-Insensitive, Space-Tolerant) ---
        if (cuisines) { 
            const cuisineNames = cuisines.split(",")
                .map(c => c.trim())
                .filter(c => c.length > 0); 
            
            const cuisineConditions = cuisineNames.map(c => ({
                // Use a $regex query for the array field. \s* handles potential leading/trailing spaces in DB data.
                cuisine: { $regex: new RegExp(`\\s*${c}\\s*`, 'i') } 
            }));

            if (cuisineConditions.length > 0) {
                // Use $or to find documents matching ANY of the requested cuisines
                filterConditions.push({ $or: cuisineConditions });
            }
        }

        // --- Categories Filter (Case-Sensitive, uses $in) ---
        // If category names are inconsistent, they should use the same $regex pattern as cuisine.
        if (categories) {
            filterConditions.push({ categories: { $in: categories.split(",").map(c => c.trim()) } });
        }
        
        // --- Tags Filter (Case-Sensitive, uses $in) ---
        if (tags) {
            filterConditions.push({ tags: { $in: tags.split(",").map(c => c.trim()) } });
        }

        // --- Geo Filter ---
        if (lat && lng && radius) {
            filterConditions.push({
                location: {
                    $near: {
                        $geometry: { type: "Point", coordinates: [parseFloat(lng), parseFloat(lat)] },
                        $maxDistance: Number(radius) * 1000
                    }
                }
            });
        }
        
        // --- General _Search Filter (Case-Insensitive $or) ---
        if (_search) {
            filterConditions.push({
                $or: [
                    { restaurant_name: { $regex: _search, $options: "i" } },
                    { description: { $regex: _search, $options: "i" } }
                ]
            });
        }

        // ===================================
        // 3. Finalize the main query object
        // ===================================
        
        let query = {};
        if (filterConditions.length > 0) {
            // Use $and to combine all conditions (Cuisine AND Location AND Search)
            query.$and = filterConditions;
        }
        
        let restaurants = Restaurant.find(query);

        // Sorting
        if (sort === "rating") restaurants = restaurants.sort({ rating: -1 });

        const result = await restaurants;

        res.status(200).json({
            success: true,
            count: result.length,
            data: result
        });

    } catch (error) {
        next(error);
    }
};