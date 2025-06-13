const {DataTypes}=require('sequelize');
const sequelize=require('../utils/db-connection');
const Group=sequelize.define('Groups',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
   name:{
      type:DataTypes.STRING,
      allowNull:false
   }
   
});
module.exports=Group;