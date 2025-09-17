const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    label: {
        type: String,
        required: [true, "Category label is required."],
        unique: true
    },
    icon: {
        type: String,
        required: [true, "Category icon is required."]
    },

},
    {
        timestamp: true,
    })

const CategorySchema = mongoose.model("Category", categorySchema);

module.exports = CategorySchema;