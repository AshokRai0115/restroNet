const { discoverVenues } = require('../services/recommendationService');
const handleError = require("../utils/handleError")

module.exports.discover = async (req, res, next) => {

    const {consumerId} =req.params.id;
    console.log(consumerId, "conusemr......................eid..............")
    // const consumerId =req.user._id;
    try {
        const results = await discoverVenues(consumerId, {
            q: req.query.q,           // from ?q=pizza
            cuisine: req.query.cuisine, // from ?cuisine=Italian
            limit: parseInt(req.query.limit) || 10
        });

        res.status(200).json({
            success: true,
            count: results.length,
            data: results
        });
    } catch (error) {
        handleError(error)
        next(error);
    }
};