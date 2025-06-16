
const AdminSchema = require("../models/authModel")
module.exports.adminSignup = async(req, res)=>{
    const{email, password, role} = req.body;
    console.log(email, password)
    try{
        const user = await AdminSchema.create({email, password, role});
        
        res.status(201).json({
            msg: 'User created successfully'})

    }catch(error){
        res.status(405).json({
            msg: `Failed to create user ${error}`})

    }
}

module.exports.adminLogin = async(req, res)=>{
    try{

        const{username, password} = req.body;
        const loginSuccess = await AdminSchema.adminLogin
    }catch(error){
        res.status(403).json({
            msg: `Failed to login user: ${error}`
        })
    }
}
