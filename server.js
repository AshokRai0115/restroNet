const express = require("express")
const mongoose = require("mongoose")
const app = express()

const authRoutes = require("./src/routes/adminRoutes")
const venueRoutes = require("./src/routes/venueRoutes")
const connDB = require("./src/config/db")
// import connDB from "./src/config/db"


require('dotenv').config();

const port = process.env.PORT || 3001;
app.use(express.json());
app.use(authRoutes);
app.use(venueRoutes)

// mongoose.connect("mongodb://127.0.0.1:27017/chautari").then(()=>{
//     console.log("connected...")
// }).catch(err=>{
//     console.log("error", err)
// })

connDB();

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
