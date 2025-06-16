
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
const loginUser=async(req,res)=>{
  try {
        const {email,password}=req.body;
        const {existingUser,token}=await userService.loginUser(email,password);
        if(!token){
            throw new AppError("Error in user login", 500);
        }
        return res.status(200).json({
            message:"user Logged in successfully",token,
            user:{id:existingUser.id,name:existingUser.name}
        })
    } catch (error) {
        if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    throw error;
    }
}
const fetchAllUsersExceptMe=async(req,res)=>{
    try {
        const {query}=req.query;
        const users=await userService.fetchAllUsersExceptMe(req.user.id,query);
        if(!users) throw new AppError("something went wrong",500);
       res.status(200).json({users,success:true});
    } catch (error) {
        if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    throw error;
    }
}
module.exports={
    signUpUser,loginUser,fetchAllUsersExceptMe
}