const mongoose = require("mongoose");

const tagSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Tag name is required."],  
        unique: true
    }
},{
    timestamp: true,
});

const TagSchema = mongoose.model("Tag", tagSchema);
module.exports = TagSchema;