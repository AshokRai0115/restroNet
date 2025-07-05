// import UserSchema from "../models/userModel";
const UserSchema = require("../models/userModel")


module.exports.signUp = async (req, res) => {
    const { email, password, name } = req.body
    try {
        const user = await UserSchema.create({ email, password, name })
        if(user){
            res.status(200).send("successfully user signup.")
        }
    } catch(err){
        res.send(err)
    }
}

module.exports.allUser = async (req, res)=>{
    try{
        const users = await UserSchema.find({})
        res.status(200).json({
                message: "Successfully retrieved all users.",
                count: users.length,
                users: users
            });
    }catch(error){
        console.error("Error fetching all users:", err);

    }
}
