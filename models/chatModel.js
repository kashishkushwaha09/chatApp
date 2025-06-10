const {DataTypes}=require('sequelize');
const sequelize=require('../utils/db-connection');
const Chat=sequelize.define('Chats',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    message:{
        type:DataTypes.STRING,
        allowNull:false
    },
   
});
module.exports=Chat;