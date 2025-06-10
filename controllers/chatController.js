const chatService=require('../services/chatService');

const addMessage=async(req,res)=>{
    try {
      
        const newUser=await chatService.addMessage(req.body.message,req.user.id);
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
module.exports={addMessage}