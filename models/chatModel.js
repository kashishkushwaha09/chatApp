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
    },
     fileName: {
    type: DataTypes.STRING,
  },
    fileUrl:{
        type:DataTypes.STRING,
    },
    fileType:{
        type:DataTypes.STRING,
    },
    isFile:{
         type:DataTypes.BOOLEAN,
         defaultValue:false
    }
});
module.exports=Chat;