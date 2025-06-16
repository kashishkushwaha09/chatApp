const User=require('./userModel');
const Chat=require('./chatModel');
const Group=require('./groupModel');
const UserGroup = require('./userGroup');

User.hasMany(Chat);
Chat.belongsTo(User);

User.hasMany(Group);
Group.belongsTo(User);

Group.hasMany(Chat);
Chat.belongsTo(Group);

User.belongsToMany(Group,{through:UserGroup});
Group.belongsToMany(User,{through:UserGroup});

UserGroup.belongsTo(User);
UserGroup.belongsTo(Group);
module.exports={
    User,Chat,Group,UserGroup
}