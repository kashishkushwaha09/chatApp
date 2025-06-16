
const UserGroup=require('../models/userGroup');
const { AppError } = require('../utils/appError');

const isAdmin=async (req,res,next)=>{
try {
    const loginUserId=parseInt(req.user.id);
    const GroupId=req.params.groupId;
    const existingMember=await UserGroup.findOne({
     where:{
        UserId:loginUserId,
        GroupId:GroupId
     }
    })
    if(existingMember?.role==='admin'){
        next();
    }else{
        throw new AppError("access denied:-Something went wrong",400);
    }
} catch (error) {
    throw new AppError(error.message,500);
}
}

module.exports=isAdmin;