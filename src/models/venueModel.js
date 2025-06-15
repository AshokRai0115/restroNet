const mongoose = require("mongoose");

const { validate } = require("./authModel");
const phoneRegex = /^(?:\+977)?0?(9[78]\d{8}|1\d{7}|[2-9]\d{6,7})$/;

const venueSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Venue name is required."],
        unique: true,
    },
    contact: {
        type: String,
        required:[true, "Contact number is required."],
        validate:{
            validator: function(value){
                return phoneRegex.test(value)
            },
            message: (props) => `${props.value} is not a valid phone number.`
        }
    },
    cousine: {
        type: String,
        required: [true, 'Cousine is required']
    }
}) 

const VenueSchema = mongoose.model('Venue', venueSchema);

module.exports = VenueSchema;