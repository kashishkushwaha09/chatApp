const express=require('express');
const router=express.Router();
const userController=require('../controllers/userController');
const authenticateUser=require('../middlewares/authenticateUser');

router.post('/signup',userController.signUpUser);
router.post('/login',userController.loginUser);
router.get('/',authenticateUser,userController.fetchAllUsersExceptMe);


module.exports=router;