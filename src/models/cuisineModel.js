const mongoose = require("mongoose");

const cuisineSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Cisine name is required."],  
        unique: true
    }
},{
    timestamp: true,
});

const CuisineSchema = mongoose.model("Cuisine", cuisineSchema);
module.exports = CuisineSchema;