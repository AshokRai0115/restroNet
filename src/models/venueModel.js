const mongoose = require("mongoose");

const { validate } = require("./authModel");
const phoneRegex = /^(?:\+977)?0?(9[78]\d{8}|1\d{7}|[2-9]\d{6,7})$/;
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const venueSchema = mongoose.Schema({
    restaurant_name: {
        type: String,
        required: [true, "Venue name is required."],
        unique: true,
    },
    restaurant_contact: {
        type: String,
        required: [true, "Contact number is required."],
        validate: {
            validator: function(value) {
                return phoneRegex.test(value)
            },
            message: (props) => `${props.value} is not a valid phone number.`
        }
    },
    restaurant_email: {
        type: String,
        required: [true, "Email Address is required."],
        validate: {
            validator: function(value) {
                return emailRegex.test(value)
            },
            message: (props) => `${props.value} is not a valid email address.`
        }
    },
    cuisine: {
        type: String,
        required: [true, 'Cuisine is required.']
    },
    restaurant_location: {
        type: String,
        required: [true, "Location is required."]
    },
    long: {
        type: Number,
        required: [true, "longitude is required"]
    },
    lat: {
        type: Number,
        required: [true, "latitude is required"]
    },
   
    description: {
        type: String,

    },
    images: [{ 
        type: String 
    }],
    logo: {
        type: String,
        // required: [true, "Logo is require."]
    }
    

})

const VenueSchema = mongoose.model('Venue', venueSchema);

module.exports = VenueSchema;