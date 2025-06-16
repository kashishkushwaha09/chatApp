const groupService = require('../services/groupService');
const { AppError } = require('../utils/appError');

const createGroup = async (req, res) => {
  try {
    const { name, userIds } = req.body;
    await groupService.createGroup(name, req.user.id, userIds);
    res.status(201).json({ message: "group created successfully", success: true });
  } catch (error) {
    throw new AppError(error.message, 500);

  }

}
const userInvolvedInGroups = async (req, res) => {
  try {
    const userWithGroups = await groupService.userInvolvedInGroups(req.user.id);
    if (!userWithGroups) {
      console.log('UserGroup')
      throw new AppError('groups not found', 404);
    }
    res.status(200).json({groups:userWithGroups,success:true});
  } catch (error) {
    if (!(error instanceof AppError)) {
      error = new AppError(error.message, 500);
    }
    throw error;
  }
}
const findAllUsersWithinGroup=async(req,res)=>{
try {
  const groupId=parseInt(req.params.id);
  const userId=req.user.id;
  console.log('findAllUsersWithinGroup ',groupId);
  console.log('findAllUsersWithinGroup ',userId);
    const groupMembers = await groupService.findAllUsersWithinGroup(groupId,userId);
    if (!groupMembers) {
      throw new AppError('groupMembers not found', 404);
    }
  console.log('findAllUsersWithinGroup',req.user.id);
    res.status(200).json({groupMembers,success:true});
  } catch (error) {
    if (!(error instanceof AppError)) {
      error = new AppError(error.message, 500);
    }
    throw error;
  }
}
const changeRole=async(req,res)=>{
  try {
    const memberId=parseInt(req.params.id);
    const role=req.body.role;
    const member= await groupService.changeRole(memberId,role);
    if(member.role == role)
    res.status(200).json({message:"User role changed successfully !",success:true});
  else throw new AppError("Something went wrong!",500);
  } catch (error) {
    if (!(error instanceof AppError)) {
      error = new AppError(error.message, 500);
    }
    throw error;
  }
}
const removeUserFromGroup=async(req,res)=>{
   try {
    const memberId=parseInt(req.params.id);
     await groupService.removeUserFromGroup(memberId);
    res.status(200).json({message:"User Removed successfully !",success:true});
  } catch (error) {
    if (!(error instanceof AppError)) {
      error = new AppError(error.message, 500);
    }
    throw error;
  }
}
const addMultipleUser=async(req,res)=>{
   try {
    const groupId=parseInt(req.params.groupId);
    let userIds=req.query.userIds;
   if (typeof userIds === 'string') {
  userIds = userIds.split(',').map(id => parseInt(id));
}
     await groupService.addMultipleUser(groupId,userIds);
    res.status(200).json({message:"Users added in group successfully !",success:true});
  } catch (error) {
    if (!(error instanceof AppError)) {
      error = new AppError(error.message, 500);
    }
    throw error;
  }
}
const findUsersNotInGroup=async(req,res)=>{
  try {
    const {query}=req.query;
     const groupId=parseInt(req.params.groupId);
     const usersNotInGroup=await groupService.findUsersNotInGroup(groupId,query);
     if(!usersNotInGroup){
      throw new AppError("No users Found",404);
     }
     res.status(200).json({users:usersNotInGroup,success:true})
  } catch (error) {
    if (!(error instanceof AppError)) {
      error = new AppError(error.message, 500);
    }
    throw error;
  }
}
const checkAdmin=async (req,res)=>{
try {
    const loginUserId=parseInt(req.user.id);
    const GroupId=req.params.groupId;
    const existingMember=await groupService.checkAdmin(loginUserId,GroupId)
    console.log("checkAdmin called")
    if(existingMember){
        res.status(200).json({message:'your role in group',role:existingMember.role,success:true})
    }
} catch (error) {
    throw new AppError(error.message,500);
}
}
module.exports = {checkAdmin, createGroup, userInvolvedInGroups,findAllUsersWithinGroup,changeRole,removeUserFromGroup,addMultipleUser,findUsersNotInGroup};