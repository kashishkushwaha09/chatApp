const {DataTypes}=require('sequelize');
const sequelize=require('../utils/db-connection');
const UserGroup=sequelize.define('UserGroups',{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
        allowNull:false
    },
    role:{
       type: DataTypes.ENUM('admin', 'member'),
        allowNull: false,
        defaultValue: 'member'
    }
});
module.exports=UserGroup;