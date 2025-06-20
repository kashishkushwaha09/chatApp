const {DataTypes}=require('sequelize');
const sequelize=require('../utils/db-connection');
const User=sequelize.define('Users',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    phone:{
        type:DataTypes.STRING,
        allowNull:false,
         validate: {
        is: /^[0-9]{10}$/ 
        }
    },
});
module.exports=User;