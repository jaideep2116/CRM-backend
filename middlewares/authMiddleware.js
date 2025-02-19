const jwt = require('jsonwebtoken');
// const Blacklist = require('../models/blacklistModel');
require('dotenv').config();
const verifyToken = async (req,res,next) =>{
    // const token = req.cookies.accessToken;
    const token=req.headers["authorization"].replace("Bearer ","");

    console.log("Token",token)
    if(!token){
        return res.status(401).json({
            success:false,
            msg:'Unauthorized request',
        })
    }
    try {
        // const secretToken = token?.replace("Bearer ", "")
        const secretKey = process.env.JWT_SECRET;
        const decodedData = jwt.verify(token,secretKey);
        req.id = decodedData.employee?._id || decodedData.admin?._id || decodedData.teamLeader?._id; 
        // console.log("decoded data from middleware",req.user)
        } catch (error) {
            console.log(error)
            return res.status(401).json({
                success:false,
                msg:'Invalid User!',
            })
    }
    
    return next();
};

module.exports = verifyToken;