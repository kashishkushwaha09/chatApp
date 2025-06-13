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


module.exports = { createGroup, userInvolvedInGroups };