// import Venue from "../models/Venue"
const Venue = require("../models/venueModel.js")
const { sendSuccess, sendError } = require("../utils/response")
const { haversine } = require("../utils/haversine")
const { triggerFeatureRecalculation } = require('../services/cbf-pipeline.js');

module.exports.all_venue = async (req, res, next) => {
    try {
        const filter = req.query.filter;
        if (!filter) {
            const allVenues = await Venue.find();
            return sendSuccess({ res, data: allVenues, message: "Restaurants fetched successfully.", statusCode: 200 });
        }
        const fields = Object.keys(Venue.schema.paths).filter(f => f !== '_id' && f !== '__v');

        const orConditions = fields.map(field => ({
            [field]: { $regex: filter, $options: 'i' }
        }));



        if (!isNaN(filter)) {
            fields.forEach(field => {
                orConditions.push({ [field]: Number(filter) });
            });
        }
      

        const filtered = await Venue.find({ $or: orConditions });

        res.status(200).json({ success: true, count: filtered.length, data: filtered, message: "Restaurants fetched" });
    } catch (error) {
        next(error)
    }
}

module.exports.get_single_venue = async (req, res, next) => {
    const id = req.params.id;
    try {
        const singleVenue = await Venue.findById(id);
        res.status(200).json({
            success: true,
            data: singleVenue,
            message: "Venue fetched successfully."
        })
        if (!singleVenue) {
            res.status(404).json({
                success: false,
                data: '',
                message: "Venue not found."
            })
        }
    } catch (error) {
        next(error)
    }
}


// module.exports.create_venue = async (req, res, next) => {
//     const { name, address, ...otherVenueData } = req.body;
//     const files = req.files;


//     try {
//         if (!files.logo || files.logo.length === 0) {
//             return res.status(400).json({
//                 msg: 'Logo image is required for venue creation.'
//             });
//         }

//         const baseUrl = `${req.protocol}://${req.get("host")}`;
//        const logoFilename = files.logo[0].filename; 
//         const logoURL = `${baseUrl}/uploads/${logoFilename}`

//        let galleryURLs = [];
//         if (files.images && files.images.length > 0) {
//             galleryURLs = files.images.map(file => {
//                  return `${baseUrl}/uploads/${file.filename}`; 
//             });
//         }
//         const venueDataToSave = {
//             name,
//             address,
//             logo: logoURL,
//             images: galleryURLs,
//             ...otherVenueData
//         };
//         const venue = await Venue.create(venueDataToSave);

//         res.status(201).json({
//             msg: "Venue created successfully.",
//             venueId: venue._id
//         });

//     } catch (error) {
//         next(error);
//     }
// };

module.exports.create_venue = async (req, res, next) => {
    // Destructure known simple fields (name, address) and capture the rest
    const { name, address, ...otherVenueData } = req.body;
    const files = req.files;
    console.log("fffffffffffffffffffffffffffffffffffffffffffff", files)

    // A variable to hold the final, parsed data for Mongoose
    let venueDataToSave = {};

    try {
        if (!files.logo || files.logo.length === 0) {
            return res.status(400).json({
                msg: 'Logo image is required for venue creation.'
            });
        }

        const baseUrl = `${req.protocol}://${req.get("host")}`;
        const logoFilename = files.logo[0].filename;
        const logoURL = `${baseUrl}/uploads/${logoFilename}`

        let galleryURLs = [];
        if (files.images && files.images.length > 0) {
            galleryURLs = files.images.map(file => {
                return `${baseUrl}/uploads/${file.filename}`;
            });
        }

        // --- 3. Parse the 'location' field if it exists in otherVenueData ---
        if (otherVenueData.location && typeof otherVenueData.location === 'string') {
            try {
                // IMPORTANT: Parse the JSON string into an object
                otherVenueData.location = JSON.parse(otherVenueData.location);

                // Optional double-check to ensure coordinates are numbers
                if (Array.isArray(otherVenueData.location.coordinates)) {
                    otherVenueData.location.coordinates = otherVenueData.location.coordinates.map(Number);
                }

            } catch (e) {
                // Handle parsing error (e.g., malformed JSON)
                return res.status(400).json({
                    msg: "Invalid JSON format for the 'location' field."
                });
            }
        }

        // --- 4. Final Data Assembly and Save ---
        venueDataToSave = {
            name,
            address,
            logo: logoURL,
            images: galleryURLs,
            ...otherVenueData // This now includes the parsed 'location' object
        };

        
        // Mongoose will now receive a valid object for the GeoJSON schema
        const venue = await Venue.create(venueDataToSave);
         
        triggerFeatureRecalculation(venue._id)
            .catch(err => {
                console.error(`CBF Trigger Failed for venue ${venue._id}:`, err);
            });

        res.status(201).json({
            msg: "Venue created successfully.",
            venueId: venue._id,
            data: venue
        });

    } catch (error) {

        next(error);
    }
};
module.exports.update_venue = async (req, res, next) => {
    try {
        const id = req.params.id;
        const baseUrl = `${req.protocol}://${req.get("host")}`;

        const { existingImages, cuisine, tags, ...otherFields } = req.body;
        
        // Parse JSON fields
        const parsedCuisine = Array.isArray(cuisine) 
    ? cuisine 
    : (cuisine ? cuisine.split(',') : []);
        const parsedTags= Array.isArray(tags) 
    ? tags 
    : (tags ? tags.split(',') : []);
        const parsedExistingImages = JSON.parse(existingImages || "[]");
        
        console.log(parsedCuisine, "<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>")
        // Prepare new images
        let newImageUrls = [];
        if (req.files.images && req.files.images.length > 0) {
            newImageUrls = req.files.images.map(file => `${baseUrl}/uploads/${file.filename}`);
        }

        // Prepare logo
        let logoUrl = otherFields?.logo; // in case old logo stays
        if (req?.files?.logo && req.files?.logo?.length > 0) {
            logoUrl = `${baseUrl}/uploads/${req?.files?.logo[0].filename}`;
        }
        const updateData = {
            ...otherFields,
            cuisine: parsedCuisine,
            tags: parsedTags,
            images: [...parsedExistingImages, ...newImageUrls],
            logo: logoUrl,
        };

        const venue = await Venue.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        return res.json({
            success: true,
            venue,
        });
    } catch (error) {
      
        console.log(error)
        next(error);
    }
};


module.exports.delete_venue = async (req, res, next) => {
    const id = req.params.id;
    try {
        const response = await Venue.findByIdAndDelete(id);
        if (response) {
            sendSuccess({ res, data: response, statusCode: 200, message: "Successfully deleted the venue." })
        }
    } catch (error) {
        next(error);
    }
}

module.exports.filterVenue = async (req, res) => {
    const filterData = req.params.filter;
    const schemaFields = Object.keys(Venue.schema.paths).filter(
        (field) => field !== '_id' && field !== '__v'
    );
}

/**
 * Find nearest venues to a user's location using Haversine formula
 * Query params: lat (latitude), lon (longitude), limit (optional, default 10), unit (optional, default 'K' for km)
 * Example: /api/venues/nearest?lat=40.7128&lon=-74.0060&limit=5&unit=K
 */
module.exports.nearest_venues = async (req, res, next) => {
    try {
        const { lat, lon, limit = 3, unit = 'K' } = req.query;

        // Validate required parameters
        if (!lat || !lon) {
            // return sendError({
            //     res,
            //     statusCode: 400,
            //     message: "Latitude and longitude are required parameters (lat, lon)"
            // });
              return res.json({
            success: false,
            status: 400,
            message: "Latitude and longitude are required parameters (lat, lon)",
        });
        }

        const userLat = parseFloat(lat);
        const userLon = parseFloat(lon);

        // Validate that lat/lon are valid numbers
        if (isNaN(userLat) || isNaN(userLon)) {
            return sendError({
                res,
                statusCode: 400,
                message: "Latitude and longitude must be valid numbers"
            });
        }

        // Validate coordinate ranges
        if (userLat < -90 || userLat > 90 || userLon < -180 || userLon > 180) {
            return sendError({
                res,
                statusCode: 400,
                message: "Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180"
            });
        }

        // Fetch all venues with location data
        const allVenues = await Venue.find({ "location.coordinates": { $exists: true } });

        // Calculate distance for each venue using Haversine formula
        const venuesWithDistance = allVenues.map(venue => {
            const [venueLon, venueLat] = venue.location.coordinates;

            // Calculate distance using haversine algorithm
            const distance = haversine(userLat, userLon, venueLat, venueLon, unit);

            return {
                ...venue.toObject(),
                distance: parseFloat(distance.toFixed(2)) // Round to 2 decimal places
            };
        });

        // Sort by distance (nearest first)
        venuesWithDistance.sort((a, b) => a.distance - b.distance);

        // Limit results
        const limitedVenues = venuesWithDistance.slice(0, parseInt(limit));

        return sendSuccess({
            res,
            data: limitedVenues,
            statusCode: 200,
            message: `Found ${limitedVenues.length} nearest restaurants within ${parseInt(limit)} venues.`
        });

    } catch (error) {
        next(error);
    }
}
