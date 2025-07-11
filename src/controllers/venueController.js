// import VenueSchema from "../models/VenueSchema"
const VenueSchema = require("../models/venueModel")

module.exports.all_venue = async(req, res)=>{
    try{
      const venues = await VenueSchema.find();
        res.status(200).json(venues); 
    } catch (err) {
        res.status(500).json({
            msg: err
        })
    }
}

module.exports.create_venue = async(req, res)=>{
    const{restraunt_name, restaurant_contact, cuisine, restaurant_location} = req.body
    try{
        const venue = await VenueSchema.create({restraunt_name, restaurant_contact, cuisine, restaurant_location})
        res.status(201).json({
            msg: "Venue created successfully."
        })
    }catch(err){
        res.status(500).json({
            msg: err
        })
    }
}
