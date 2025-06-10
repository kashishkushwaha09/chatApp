const Chat=require('../models/chatModel');

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


module.exports={
    addMessage
}