const mongoose = require("mongoose");

const menuSchema = mongoose.Schema({
    item_name: {
        type: String,
        required: [true, "Menu name is required."],
        unique: true
    },
    description: {
        type: String,
    },
    category: {
        type: [String],
        required: [true, "Menu category is required."]
    },
    price: {
        type: Number,
        required: [true, "Menu price is required."]
    },
    ingredients: {
        type: [String],
    },
    spice_level: {
        type: Number,
        min: 0,
        max: 5,
        default: 0

    },
    preparation_time: {
        type: Number,
        min: 0,
    },
    availability: {
        type: Boolean
    },
    ratings: {
        type: Number,
         min: 0,
        max: 5,
        default: 0
    },
    featured_image: {
        type: String
    }


}, {
    timestamps: true
})

const MenuSchema = mongoose.model("Menu", menuSchema);
module.exports = MenuSchema;