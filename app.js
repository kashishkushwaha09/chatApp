require('dotenv').config();
const express=require('express');
const app=express();
const db=require('./utils/db-connection');
app.use(express.static('public'));

db.sync({alter:true}).then(()=>{
app.listen(4200,()=>{
    console.log("server is listening on port 4200");
    
})
})
 .catch((err)=>{
    console.log(err);
})