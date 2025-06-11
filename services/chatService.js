const Chat=require('../models/chatModel');
const { Op } = require('sequelize');
const addMessage=async(message,userId)=>{
try {
    const newChat=await Chat.create({
        message,UserId:userId
    });
    return newChat;
} catch (error) {
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    throw error;
}
}
const getMessages=async(lastMsgId)=>{
  try {
    const allChats=await Chat.findAll({
        where:{
            id:{
                [Op.gt]:lastMsgId
            }
        }
    });
    return allChats;
} catch (error) {
    if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    throw error;
}  
}

module.exports={
    addMessage,getMessages
}