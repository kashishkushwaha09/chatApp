const express=require('express');
const router=express.Router();
const multer=require('multer');
const upload=multer();
const chatController=require('../controllers/chatController');

router.post('/',chatController.addMessage);
router.post('/upload',upload.single('file'),chatController.uploadFile);
router.get('/',chatController.getMessages);
router.get('/groupChats/:id',chatController.fetchAllGroupMessages);



module.exports=router;