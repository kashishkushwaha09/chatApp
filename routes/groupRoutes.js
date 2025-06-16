const express=require('express');
const router=express.Router();
const groupController=require('../controllers/groupController');
const isAdmin=require('../middlewares/checkAdmin');
router.post('/',groupController.createGroup);

router.get('/userWithGroups',groupController.userInvolvedInGroups);
router.get('/checkAdmin/:groupId',groupController.checkAdmin);
router.get('/usersNotInGroup/:groupId',groupController.findUsersNotInGroup)
router.get('/groupMembers/:id',groupController.findAllUsersWithinGroup);
router.put('/changeRole/:id/:groupId',isAdmin,groupController.changeRole);
router.delete('/deleteUserFromGroup/:id/:groupId',isAdmin,groupController.removeUserFromGroup);
router.post('/addUsersInGroup/:groupId',isAdmin,groupController.addMultipleUser);


module.exports=router;