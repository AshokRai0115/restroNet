const express = require("express")
const mongoose = require("mongoose")
const app = express();
const handleError = require("./src/utils/handleError")

const authRoutes = require("./src/routes/adminRoutes")
const venueRoutes = require("./src/routes/venueRoutes")
const menuRoutes = require("./src/routes/menuRoutes")
const categoryRoutes = require("./src/routes/categoryRoutes")
const userRoutes = require("./src/routes/userRoutes")
const connDB = require("./src/config/db")
const cors = require('cors');
// const bodyParser = require('body-parser');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));




require('dotenv').config();

const port = process.env.PORT || 3001;

app.use(cors())
// app.use(bodyParser.json())
app.use(express.json());
app.use(authRoutes);
app.use(venueRoutes)
app.use(menuRoutes)
app.use(categoryRoutes)
app.use(userRoutes)

connDB();

app.use((err, req, res, next) => {
    console.log(err, ".......   ")
  const errors = handleError(err);
  res.status(400).json({ success: false, errors }); 
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
