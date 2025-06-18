// const { AppError } = require("../utils/appError");

const token = localStorage.getItem("token");
const msgForm = document.getElementById('message-form');
const createGroupForm = document.getElementById('create-group');
const newGroupBtn = document.getElementById('newGroupBtn');
const newGroupForm = document.getElementById('newGroupForm');
const selectUserDiv = document.getElementById('select-users');
const groupList=document.getElementById('groupList');
const chatHeader=document.getElementById('chatHeader');
const url = '/api'

if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

async function addMessage(event) {
    const message = event.target.message.value;
    const groupId=localStorage.getItem('groupId');

    console.log(message);
    try {
        if(groupId){
          const response = await axios.post(`${url}/chats`, {
            message,groupId:parseInt(groupId)
        })
        console.log(response);
        if (response?.data) {
            alert(response.data.message);
             const chats=await getAllChats(groupId);
             showChats(chats);
            //  sessionStorage.removeItem('groupId');
        }
        }else{
            alert('select group then chat')
        }
       
    } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || error.message);
    }

}
async function fetchChats(lastMsgId) {
    try {
        const response = await axios.get(`${url}/chats?lastMsgId=${lastMsgId}`);
        console.log(response);
        return response.data.chats;
    } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || error.message);
    }
}
async function getAllChats(groupId) {
    // let messages = JSON.parse(localStorage.getItem('groupMessages')) || [];
    // let lastMsgId = messages.length > 0 ? messages[messages.length - 1].id : 0;
    // console.log(messages);
    const newMessages = await fetchGroupChats(groupId,0);
    console.log("newMessages",newMessages);
    // messages = [...messages, ...newMessages];
    const recentMessages = newMessages.slice(-10);

    localStorage.setItem('groupMessages', JSON.stringify(recentMessages));
    return recentMessages;
}
async function showChats(chats) {
    console.log(chats);
    const chatList = document.getElementById('messages');
    chatList.innerHTML = '';
    chats?.forEach((chat, index) => {
        const list = document.createElement('li');
        list.innerHTML =`<span class="fw-semibold">${chat.User.name}:</span> ${chat.message}`;
        list.classList.add('list-group-item');
    
        if ((index + 1) % 2 !== 0) {
            list.classList.add('list-group-item-light');
        } else {
            list.classList.add('list-group-item-dark');
        }
        chatList.appendChild(list);
    });
}
async function fetchAllUsersExceptMe() {
    try {
        const response = await axios.get(`${url}/users`);
        console.log(response);
        const users = await response.data.users;
        return users;
    } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || error.message);
    }
}
function addInSelectUsers(users) {
    selectUserDiv.innerHTML='';
    users.forEach((user) => {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group mb-3';
        inputGroup.innerHTML = `
       <input type="checkbox" name="users" value="${user.id}">
       <label for="vehicle1" class="mx-1">${user.name}</label>
       `;
       selectUserDiv.appendChild(inputGroup);
        });
}
async function createGroup(name,userIds){
    try {
      const response= await axios.post(`${url}/groups`,{
    name,userIds
   })
   if(response?.data?.message){
    alert(response.data.message);
    return true;
   }   
    } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || error.message);
    }
  
}
async function handleGroupSubmit(event){
event.preventDefault();
const groupName=event.target.groupName.value;
// console.log("newform is submitted ",groupName);
const checkedUsers = [];
const checkboxes=selectUserDiv.querySelectorAll('input[type="checkbox"]:checked');
checkboxes.forEach(cb => checkedUsers.push(parseInt(cb.value)));
    // console.log('Selected Users:', checkedUsers);
    if(checkedUsers.length>0){
        const isCreated=await createGroup(groupName,checkedUsers);
        console.log("isCreated",isCreated);
        if(isCreated){
            checkboxes.forEach(cb =>cb.checked=false);
            document.getElementById('groupName').value='';
             showGroups();
        }
    }
}
async function fetchUserGroups(){
  try {
      const response= await axios.get(`${url}/groups/userWithGroups`)
   if(response?.data){
      return response.data.groups.Groups;
   }   
    } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || error.message);
    }
}
async function fetchGroupChats(groupId,lastMsgId){
   try {
      const response= await axios.get(`${url}/chats/groupChats/${groupId}?lastMsgId=${lastMsgId}`)
   if(response?.data){
     const chats=response.data.messages;
    return chats;
   }   
    } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || error.message);
    }
}
async function showGroups(){
    groupList.innerHTML='';
const userGroups=await fetchUserGroups();
console.log("user unvolved with groups",userGroups);
userGroups?.forEach((group)=>{
    const list=document.createElement('li');
    list.className='btn btn-outline-primary mt-1';
    list.setAttribute('groupId',group.id);
    list.innerText=group.name;
    // listener added
    list.addEventListener('click',async()=>{
        groupList.querySelectorAll('li').forEach(list=> list.classList.remove('active'));
        list.classList.add('active');
      const chats=await getAllChats(group.id);
      localStorage.setItem('groupId',group.id);
      localStorage.setItem('groupName',group.name);
      chatHeader.querySelector('h3').innerText=group.name;
         showChats(chats);
    })
    groupList.appendChild(list);
})
}
async function searchUsersByQuery(searchTerm) {
     try {
        const response = await axios.get(`${url}/users?query=${searchTerm}`);
        console.log(response);
        const users = await response.data.users;
      return users;
    } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || error.message);
    }
}
async function searchUsers(){
    let searchTerm = document.getElementById('searchInput').value;
        let users = await searchUsersByQuery(searchTerm);
        if(users.length===0){
            users=await fetchAllUsersExceptMe();
        }
      addInSelectUsers(users);
}
document.getElementById('searchInput')?.addEventListener('input',searchUsers);
msgForm.addEventListener('submit', (event) => {
    event.preventDefault();
    addMessage(event);
})
newGroupBtn.addEventListener('click', async () => {
    const users = await fetchAllUsersExceptMe();
    if (users?.length > 0) {
        addInSelectUsers(users);
    }
})
newGroupForm.addEventListener('submit',handleGroupSubmit);
chatHeader.addEventListener('click',()=>{
    const groupId=parseInt(localStorage.getItem('groupId'));
    if(groupId){
        console.log(`chatHeader is clicked ${groupId}`);
        window.location.assign('groupDetail.html')
    }
})
document.addEventListener('DOMContentLoaded', () => {
    // setInterval(() => {
   localStorage.removeItem('groupId');
    showGroups();
    // }, 1000);

});