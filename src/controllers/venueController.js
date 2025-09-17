// import VenueSchema from "../models/VenueSchema"
const VenueSchema = require("../models/venueModel")
const {sendSuccess, sendError} = require("../utils/response")

module.exports.all_venue = async (req, res, next) => {
    try {
        const filter = req.query.filter;
        console.log("all venue")
        if (!filter) {
            const allVenues = await VenueSchema.find();
            return sendSuccess({ success: true, count: allVenues.length, data: allVenues, message: "Restaurants fetched successfully." });
        }
        const fields = Object.keys(VenueSchema.schema.paths).filter(f => f !== '_id' && f !== '__v');
        console.log("after check")

        const orConditions = fields.map(field => ({
            [field]: { $regex: filter, $options: 'i' }
        }));


        if (!isNaN(filter)) {
            fields.forEach(field => {
                orConditions.push({ [field]: Number(filter) });
            });
        }

        const filtered = await VenueSchema.find({ $or: orConditions });

        res.status(200).json({ success: true, count: filtered.length, data: filtered, message: "Restaurants fetched" });
    } catch (error) {
        next(error)
    }
}

module.exports.create_venue = async (req, res, next) => {
    const newData = req.body
    try {
        const venue = await VenueSchema.create(newData)
        res.status(201).json({
            msg: "Venue created successfully."
        })
    } catch (error) {
       next(error)
    }
}

module.exports.update_venue = async (req, res) => {
    const updatedData = req.body;
    const id = req.params.id;
    try {
        const venue = await VenueSchema.findByIdAndUpdate({
            id,
            updatedData,
        })

    } catch (err) {
        res.status(500).json({
            msg: err
        })
    }
}

module.exports.filterVenue = async (req, res) => {
    const filterData = req.params.filter;
    const schemaFields = Object.keys(Venue.schema.paths).filter(
        (field) => field !== '_id' && field !== '__v'
    );
    console.log(schemaFields, "ifle")
}
