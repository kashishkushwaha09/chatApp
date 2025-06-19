const chatService = require('../services/chatService');
const { AppError } = require('../utils/appError');

const addMessage = async (req, res) => {
    try {
        const { message, groupId } = req.body;
        const newChat = await chatService.addMessage(message, req.user.id, groupId);
        if (!newChat) {
            throw new AppError("Error creating Chat", 500);
        }
        return res.status(201).json({
            message: "Chat created successfully",
            chat:newChat
        })
    } catch (error) {
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);
        }
        throw error;
    }
}
const uploadFile = async (req, res) => {
    try {
        const file = req.file;
         const {groupId } = req.body;
        const newChat = await chatService.uploadFile(file, req.user.id, groupId)
        if (!newChat) {
            throw new AppError("Error creating Chat", 500);
        }
        return res.status(201).json({
            message: "Chat created successfully",
            chat:newChat
        })
    } catch (error) {
        console.log(error);
      if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);
        }
        throw error;
        // or 
       
    }

}
const getMessages = async (req, res) => {
    try {
        const lastMsgId = req.query.lastMsgId;
        const allChats = await chatService.getMessages(lastMsgId);
        if (!allChats) {
            throw new AppError("Something went wrong", 500);
        }
        return res.status(200).json({
            message: "Chats found successfully", chats: allChats
        })
    } catch (error) {
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);
        }
        throw error;
    }
}
const fetchAllGroupMessages = async (req, res) => {
    try {
        const groupid = req.params.id;
        const lastMsgId = req.query.lastMsgId || 0;
        const userId = req.user.id;
        const messages = await chatService.fetchAllGroupMessages(userId, groupid, lastMsgId);
        if (!messages) {
            throw new AppError('something went wrong', 500);
        }
        res.status(200).json({ messages, success: true })
    } catch (error) {
        if (!(error instanceof AppError)) {
            error = new AppError(error.message, 500);
        }
        throw error;
    }

}
module.exports = { addMessage, uploadFile, getMessages, fetchAllGroupMessages }