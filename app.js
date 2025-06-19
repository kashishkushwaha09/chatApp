require('dotenv').config();
const path=require('path');
const express=require('express');
const http = require('http');
const app=express();
const {Server}=require('socket.io');
const server=http.createServer(app);
const io=new Server(server);
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
const users={};
db.sync({alter:true}).then(()=>{
  io.on('connection',(socket)=>{
    console.log('A user connected');

 socket.on('join-group', (groupId) => {
    const roomName = groupId.toString();
    socket.join(roomName);
    console.log(`👥 User joined group ${typeof groupId}`);
  });
socket.on('new-user',name=>{
  users[socket.id]=name;
  // socket.broadcast.emit('user-connected',name);
})
socket.on('send-chat-message',data=>{
  const roomName = data.groupId.toString();
  console.log('send-chat-message ',typeof data.groupId);
  io.to(roomName).emit('receive-chat-message',data)
})
    socket.on('disconnect',()=>{
        console.log('A user disconnected');
        delete users[socket.id]
    })
  })
server.listen(4200,()=>{
    console.log("server is listening on port 4200");
    
})
})
 .catch((err)=>{
    console.log(err);
})