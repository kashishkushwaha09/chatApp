
const userService=require('../services/userService');
const { AppError } = require('../utils/appError');

const signUpUser=async(req,res)=>{  
    try {
      
        const newUser=await userService.signUpUser(req.body);
        if(!newUser){
            throw new AppError("Error creating user", 500);
        }
        return res.status(201).json({
            message:"user created successfully"
        })
    } catch (error) {
        if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    throw error;
    }
}


module.exports={
    signUpUser
}