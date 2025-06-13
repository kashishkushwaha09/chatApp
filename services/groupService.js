const Group=require('../models/groupModel');
const UserGroup=require('../models/userGroup');
const sequelize=require('../utils/db-connection');
const User=require('../models/userModel');
const { AppError } = require('../utils/appError');

const createGroup=async(name,UserId,userIds)=>{
  const transaction=await sequelize.transaction();
  try {
    const newGroup=await Group.create({
     name,UserId
    },{ transaction: transaction });
   
      const addUserInGroup=await UserGroup.create({
        UserId,GroupId:newGroup.id,role:'admin'
    },{ transaction: transaction });
  //add multiple Users
  for(const id of userIds){
     const existingUser=await User.findByPk(id,{transaction:transaction});
    if(!existingUser){
    throw new AppError('User not found',404);
    }
    await UserGroup.create({
      UserId:existingUser.id,GroupId:newGroup.id,role:'member'
    },{ transaction: transaction })
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
const userInvolvedInGroups=async(userId)=>{
  try {
    const userWithGroups=await User.findByPk(userId,{
      attributes:['id','name','email'],
      include:[{
        model:Group,
        through:{attributes:['role']},
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


module.exports={createGroup,userInvolvedInGroups};