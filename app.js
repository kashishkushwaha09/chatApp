const express=require('express');
const app=express();
app.use(express.static('public'));

 app.listen(4200,()=>{
    console.log("server is listening on port 4200");
    
})