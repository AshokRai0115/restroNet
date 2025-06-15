// import {Admin} from '../models/authModel';
// import jwt from 'jsonwebtoken';
const AdminSchema = require("../models/authModel")
module.exports.adminSignup = async(req, res)=>{
    const{email, password, role} = req.body;
    try{
        const user = await AdminSchema.create(email, password, role);
        
        res.status(201).json({
            msg: 'User created successfully'})

    }catch(error){
        res.status(405).json({
            msg: `Failed to create user ${error}`})

    }
}
