const mongoose = require("mongoose");
const dotenv = require("dotenv");
const AdminSchema = require("../models/authModel")

dotenv.config();

const connDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to mongodb successfully!!")
        AdminSchema.init().catch(err => console.log(err));

    }catch(error){
        console.log("Failed to connect to mongodb: ", error);
        process.exit(1);
    }
    
}

module.exports = connDB;