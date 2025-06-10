const jwt=require('jsonwebtoken');
const { AppError } = require('../utils/appError');
const User=require('../models/userModel');

const authenticateUser=async(req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer ')){
      throw new AppError('User Unauthorized',401);
    }
    try {
        const token=authHeader.split(' ')[1];
        const decode=jwt.verify(token,process.env.SECRET_KEY);
        const user=await User.findByPk(decode.userId);
        req.user=user;
        next();

    } catch (error) {
         if (!(error instanceof AppError)) {
                error = new AppError(error.message, 500);
            }
            throw error;
    }
}
module.exports=authenticateUser;