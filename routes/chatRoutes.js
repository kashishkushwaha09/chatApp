const express=require('express');
const router=express.Router();
const chatController=require('../controllers/chatController');

router.post('/',chatController.addMessage);
router.get('/',chatController.getMessages);



module.exports=router;