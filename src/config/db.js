const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connDB = async () =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to mongodb successfully!!")
    }catch(error){
        console.log("Failed to connect to mongodb: ", error);
        process.exit(1);
    }
    
}

module.exports = connDB;