require('dotenv').config();
const express=require('express');
const app=express();
const db=require('./utils/db-connection');
const errorMiddleware=require('./middlewares/errorHandler');
const userRoutes=require('./routes/userRoutes');
app.use(express.static('public'));
app.use(express.json());

app.use('/api/users', userRoutes);
app.use(errorMiddleware);

db.sync({alter:true}).then(()=>{
app.listen(4200,()=>{
    console.log("server is listening on port 4200");
    
})
})
 .catch((err)=>{
    console.log(err);
})