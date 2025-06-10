require('dotenv').config();
const express=require('express');
const app=express();
const db=require('./utils/db-connection');
const errorMiddleware=require('./middlewares/errorHandler');
const authenticateUser=require('./middlewares/authenticateUser');
const userRoutes=require('./routes/userRoutes');
const chatRoutes=require('./routes/chatRoutes');
require('./models');
app.use(express.static('public'));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/chats',authenticateUser,chatRoutes);

app.use(errorMiddleware);

db.sync({alter:true}).then(()=>{
app.listen(4200,()=>{
    console.log("server is listening on port 4200");
    
})
})
 .catch((err)=>{
    console.log(err);
})