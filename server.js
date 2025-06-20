const express = require("express")
const mongoose = require("mongoose")
const app = express()

const authRoutes = require("./src/routes/adminRoutes")
const venueRoutes = require("./src/routes/venueRoutes")
const connDB = require("./src/config/db")


require('dotenv').config();

const port = process.env.PORT || 3001;
app.use(express.json());
app.use(authRoutes);
app.use(venueRoutes)

connDB();


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
