require('dotenv').config();
const path=require('path');
const express=require('express');
const app=express();
const cors = require('cors');
const db=require('./utils/db-connection');
const errorMiddleware=require('./middlewares/errorHandler');
const authenticateUser=require('./middlewares/authenticateUser');
const userRoutes=require('./routes/userRoutes');
const chatRoutes=require('./routes/chatRoutes');
const groupRoutes=require('./routes/groupRoutes');
require('./models');
app.use(express.static('public'));
app.use(express.json());
app.use(cors());
// Redirect root URL to signup.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});
app.use('/api/users', userRoutes);
app.use('/api/chats',authenticateUser,chatRoutes);
app.use('/api/groups',authenticateUser,groupRoutes);

app.use(errorMiddleware);

db.sync({alter:true}).then(()=>{
app.listen(4200,()=>{
    console.log("server is listening on port 4200");
    
})
})
 .catch((err)=>{
    console.log(err);
})