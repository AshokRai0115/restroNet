const mongoose = require("mongoose");

const cuisineSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Cuisine name is required."],  
        unique: true
    }
},{
    timestamp: true,
});

const CuisineSchema = mongoose.model("Cuisine", cuisineSchema);
module.exports = CuisineSchema;