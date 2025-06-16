const Group = require('../models/groupModel');
const UserGroup = require('../models/userGroup');
const sequelize = require('../utils/db-connection');
const User = require('../models/userModel');
const { AppError } = require('../utils/appError');
const { Op } = require('sequelize');

const createGroup = async (name, UserId, userIds) => {
  const transaction = await sequelize.transaction();
  try {
    const newGroup = await Group.create({
      name, UserId
    }, { transaction: transaction });

    const addUserInGroup = await UserGroup.create({
      UserId, GroupId: newGroup.id, role: 'admin'
    }, { transaction: transaction });
    //add multiple Users
    for (const id of userIds) {
      const existingUser = await User.findByPk(id, { transaction: transaction });
      if (!existingUser) {
        throw new AppError('User not found', 404);
      }
      await UserGroup.create({
        UserId: existingUser.id, GroupId: newGroup.id, role: 'member'
      }, { transaction: transaction })
    }

    transaction.commit();
  } catch (error) {
    transaction.rollback();
    if (!(error instanceof AppError)) {
      error = new AppError(error.message, 500);
    }
    throw error;
  }
}
const userInvolvedInGroups = async (userId) => {
  try {
    const userWithGroups = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email'],
      include: [{
        model: Group,
        through: { attributes: ['role'] },
      }]
    });
    return userWithGroups;
  } catch (error) {

    if (!(error instanceof AppError)) {
      error = new AppError(error.message, 500);
    }
    throw error;
  }
}

const findAllUsersWithinGroup = async (groupId, userId) => {
  try {
    const existingUser = await UserGroup.findOne({
      where: {
        UserId: userId, GroupId: groupId
      }
    });
    if (!existingUser) {
      throw new AppError('User is not a group member', 403);
    }
    const groupMembers = await UserGroup.findAll({
      where: {
        GroupId: groupId
      },
      attributes: ['id', 'role'],
      include: [
        { model: User, attributes: ['id', 'name'] }
      ]
    });
    return groupMembers;
  } catch (error) {
    if (!(error instanceof AppError)) {
      error = new AppError(error.message, 500);
    }
    throw error;
  }
}
const changeRole = async (memberId,role) => {
  try {
     const member=await UserGroup.findByPk(memberId);
        if(!member){
          throw new AppError("user not found in group",404);
        }
        member.role=role;
        member.save();
      return member;

  } catch (error) {
      if (!(error instanceof AppError)) {
      error = new AppError(error.message, 500);
    }
    throw error;
  }
}
const removeUserFromGroup=async(memberId)=>{
  try {
     const member=await UserGroup.findByPk(memberId);
        if(!member){
          throw new AppError("user not found in group",404);
        }
      await UserGroup.destroy({
        where:{
          id:memberId
        }
      });

  } catch (error) {
      if (!(error instanceof AppError)) {
      error = new AppError(error.message, 500);
    }
    throw error;
  }
}
const addMultipleUser=async (groupId,userIds)=>{
  try {
     //add multiple Users
     console.log("userIDS ",userIds);
    for (const id of userIds) {
      const existingUser = await User.findByPk(id);
      if (!existingUser) {
        throw new AppError('User not found', 404);
      }
       // Check if the user is already in the group
  const alreadyInGroup = await UserGroup.findOne({
    where: {
      UserId: id,
      GroupId: groupId
    }
  });

  if (alreadyInGroup) {
    console.log(`User ${id} is already in group ${groupId}, skipping...`);
    continue; // skip this user
  }
      await UserGroup.create({
        UserId: existingUser.id, GroupId: groupId, role: 'member'
      })
    }
  } catch (error) {
    console.log(error);
     if (!(error instanceof AppError)) {
      error = new AppError(error.message, 500);
    }
    throw error;
  }

}
const findUsersNotInGroup=async(groupId,query)=>{
  try {
    const usersInGroup= await UserGroup.findAll({
    where:{GroupId:groupId},
    attributes:['UserId']
  });
  const userIdsInGroup=usersInGroup.map(entry=>entry.UserId);
    const whereClause = {
            id: {
    [Op.notIn]: userIdsInGroup
  }
        };
        if (query) {
            whereClause[Op.or] = [
    { name: { [Op.like]: `%${query}%` } },
    { email: { [Op.like]: `%${query}%` } },
    { phone: { [Op.like]: `%${query}%` } }
  ];
}
  const usersNotInGroup=await User.findAll({
    where:whereClause
  });
  return usersNotInGroup;
  } catch (error) {
    console.log(error);
     if (!(error instanceof AppError)) {
      error = new AppError(error.message, 500);
    }
    throw error;
  }
  
}
const checkAdmin=async (loginUserId,GroupId)=>{
try {

    const existingMember=await UserGroup.findOne({
     where:{
        UserId:loginUserId,
        GroupId:GroupId
     }
    })
   return existingMember;
} catch (error) {
    throw new AppError(error.message,500);
}
}
module.exports = { checkAdmin,createGroup, userInvolvedInGroups, findAllUsersWithinGroup,changeRole,removeUserFromGroup,addMultipleUser,findUsersNotInGroup};