const chatService=require('../services/chatService');
const { AppError } = require('../utils/appError');

const addMessage=async(req,res)=>{
    try {
      const {message,groupId}=req.body;
        const newUser=await chatService.addMessage(message,req.user.id,groupId);
        if(!newUser){
            throw new AppError("Error creating Chat", 500);
        }
        return res.status(201).json({
            message:"Chat created successfully"
        })
    } catch (error) {
        if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    throw error;
    }
}
const getMessages=async(req,res)=>{
   try {
       const lastMsgId=req.query.lastMsgId;
        const allChats=await chatService.getMessages(lastMsgId);
        if(!allChats){
            throw new AppError("Something went wrong", 500);
        }
        return res.status(200).json({
            message:"Chats found successfully",chats:allChats
        })
    } catch (error) {
        if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    throw error;
    } 
}
const fetchAllGroupMessages=async(req,res)=>{
    try {
        const groupid=req.params.id;
         const lastMsgId=req.query.lastMsgId || 0;
    const userId=req.user.id;
    const messages=await chatService.fetchAllGroupMessages(userId,groupid,lastMsgId);
    if(!messages){
     throw new AppError('something went wrong',500);
    }
    res.status(200).json({messages,success:true}) 
    } catch (error) {
       if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    throw error;  
    }
   
}
module.exports={addMessage,getMessages,fetchAllGroupMessages}