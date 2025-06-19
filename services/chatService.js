const UserGroup = require('../models/userGroup');
const Chat=require('../models/chatModel');
const { Op } = require('sequelize');
const User = require('../models/userModel');
const AWS=require('aws-sdk');
const { AppError } = require('../utils/appError');

function uploadToS3(data,fileName,mimetype){
      const BUCKET_NAME='multimedia8097025586201';
    const IAM_USER_KEY=process.env.IAM_USER_KEY;
    const IAM_USER_SECRET=process.env.IAM_USER_SECRET;

    const s3=new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET
    });

    const params={
        Bucket:BUCKET_NAME,
        Key:fileName,
        Body:data,
        ContentType: mimetype,
        ACL:'public-read',
    }
     return s3.upload(params).promise();
}
// {
//   fieldname: 'file',
//   originalname: 'B612_20220602_225434_406.jpg',
//   encoding: '7bit',
//   mimetype: 'image/jpeg',
//   buffer: <Buffer ... >,
//   size: 1994003
// }

const uploadFile=async(file,UserId,GroupId)=>{
    try {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
    const fileName=`${timestamp}-${file.originalname}`;
    const fileBuffer=file.buffer;
    const mimetype=file.mimetype;
    const response=await uploadToS3(fileBuffer,fileName,mimetype);
    const newChat=await Chat.create({
        fileName,fileUrl:response.Location,fileType:file.mimetype,isFile:true,UserId,GroupId,
    });
    return newChat;
    } catch (error) {
        throw new AppError(error.message, 500);
    }
 
}
const addMessage=async(message,UserId,GroupId)=>{
try {
    let newChat;
    if(message.trim().length>0){
       newChat=await Chat.create({
        message,UserId,GroupId,
    });
}
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
    addMessage,getMessages,fetchAllGroupMessages,uploadFile
}