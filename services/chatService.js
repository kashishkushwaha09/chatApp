const UserGroup = require('../models/userGroup');
const Chat=require('../models/chatModel');
const { Op } = require('sequelize');
const User = require('../models/userModel');
const addMessage=async(message,UserId,GroupId)=>{
try {
    const newChat=await Chat.create({
        message,UserId,GroupId,
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
const fetchAllGroupMessages=async(UserId,GroupId,lastMsgId)=>{
    try {
          const isMember=await UserGroup.findOne({
    where:{
      UserId,GroupId
    }
  });
  if(!isMember){
    throw new AppError('you are not a member of this group',403);
  }
  const messages=await Chat.findAll({
    where:{
         id:{
                [Op.gt]:lastMsgId
            },
        GroupId,
    },
    include:[{
        model:User,
        attributes:['id','name']
    }],
    order: [['createdAt', 'ASC']]
  });
  return messages;
    } catch (error) {
      if (!(error instanceof AppError)) {
        error = new AppError(error.message, 500);
    }
    throw error;  
    }

  
}
module.exports={
    addMessage,getMessages,fetchAllGroupMessages
}