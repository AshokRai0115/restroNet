const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
// const adminSchema = require("../models/authModel")

const adminSchema = new mongoose.Schema({
    email:{
        type: String,
        required:[true, "Please enter an email"],
        validator:[isEmail, "Please enter a valid email"],
        unique:true,        
    },
    password:{
        type: String,
        required:[true, "Please enter a password"],
        minlength:[6, "Minimum password length is 6 characters"]
    },
    role:{
        type: String,
        required:[true, "Please enter a role"],
        default:"user",
        enum:["admin", "user"],
    }
}); 

adminSchema.pre("save", async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

adminSchema.statics.login = async function(email, password){
    const admin = await this.findOne({email});
    if(admin){
        const auth = await bcrypt.compare(password, admin.password);
        if(auth){
            return admin;
        }
        throw Error("Incorrect password");
    }
    throw Error("Incorrect email");
}

const AdminSchema = mongoose.model("adminSchema", adminSchema);
module.exports = AdminSchema;

