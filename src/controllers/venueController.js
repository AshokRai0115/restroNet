// import VenueSchema from "../models/VenueSchema"
const VenueSchema = require("../models/venueModel")

module.exports.all_venue = async(req, res)=>{
    try{
        res.status(200).json({
            msg: "successful msg"
        })
    }catch(err){
        res.status(500).json({
            msg: err
        })
    }
}

module.exports.create_venue = async(req, res)=>{
    const{name, contact, cousine} = req.body
    try{
        const venue = await VenueSchema.create({name, contact, cousine})
        res.status(201).json({
            msg: "Venue created successfully."
        })
    }catch(err){
        res.status(500).json({
            msg: err
        })
    }
}
