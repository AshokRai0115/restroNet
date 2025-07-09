// import User from "../models/userModel";
const User = require("../models/userModel")
const jwt = require("jsonwebtoken")



const maxAge = 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, "token id", {
        expiresIn: maxAge
    })
}

function handleError(err){
    let error = {email: '', password: ''}
    if(err.message == "Email is incorrect."){
        error.email = "Please enter valid email"

    }

    if(err.message == "Password is incorrect"){
        
        error.password = "Password didn't match. Try Again."
    }

    if(err.code == 11000){
        if(err.keyPattern.email){
            error.email = "Email already used"
        }
        if(err.keyPattern.username){
            error.username = "username already taken"
        }
        if(err.keyPattern.password){
            error.password = "Password must be 8 characters long"
        }
        return error
    }
    if(err.message.includes("user validation failed")){
        Object.values(err.errors).forEach(({properties})=>{
            error[properties.path] = properties.message
        })
    }
    return error

}


module.exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log(email, password)
        const user = await User.login(email, password);
        if (user) {
            const token = createToken(user._id)
            res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge })
            res.status(200).json({message:"successfully logged in.", user, token })
        }
    }catch(error){
        const err = handleError(error);
        res.status(400).send(err, "error", error);
    }
   
}

module.exports.signUp = async (req, res) => {
    const { email, password, username } = req.body
    try {
        const user = await User.create({ email, password, username })
        if (user) {
            res.status(201).send("successfully user signup.")
        }
    } catch (error) {
        console.log(error)
        const err = handleError(error);
        res.status(400).send(err);
    }
}


module.exports.allUser = async (req, res) => {
    try {
        const users = await User.find({})
        res.status(200).json({
            message: "Successfully retrieved all users.",
            count: users.length,
            users: users
        });
    } catch (error) {
        console.error("Error fetching all users:", err);

    }
}
