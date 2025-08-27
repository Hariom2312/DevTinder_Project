const jwt = require("jsonwebtoken");
const User = require("../model/User");
require("dotenv").config();

exports.auth = async(req,res,next)=>{
    try {
        const token = req.cookies.loginToken;

        if(!token){
            return res.status(401).json({
                message:"No token provided, authorization denied"
            })
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET); 
        const{_id} = decoded;
        const user = await User.findById(_id);
        // user.password = undefined;
        req.user = user;
        next(); 
    } catch (error) {
        console.error("Auth Middleware Error:", error);
        return res.status(401).json({
            message:"Token is not valid in Auth try again",
            error,
        });
    }
}