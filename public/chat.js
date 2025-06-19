// const { AppError } = require("../utils/appError");
const socket = io();
const name = sessionStorage.getItem('userName')
socket.emit('new-user', name)
socket.on('connect', () => {
    console.log('Connected to socket server');
});
socket.on('disconnect', (reason) => {
    console.log('Chat Page Disconnected:', reason);
});
const token = sessionStorage.getItem("token");
const msgForm = document.getElementById('message-form');
const createGroupForm = document.getElementById('create-group');
const newGroupBtn = document.getElementById('newGroupBtn');
const newGroupForm = document.getElementById('newGroupForm');
const selectUserDiv = document.getElementById('select-users');
const groupList = document.getElementById('groupList');
const chatHeader = document.getElementById('chatHeader');
  const chatList = document.getElementById('messages');
const url = '/api'

if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}
async function sendMessage(message,groupId) {
    try {
            const response = await axios.post(`${url}/chats`, {
                message, groupId: parseInt(groupId)
            })
            console.log(response);
            if (response?.data) {
                alert(response.data.message);
                return response.data.chat;
            }

    } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || error.message);
    }

}
async function sendMedia(file,groupId) {
     try {
             const formData=new FormData();
            formData.append('file',file);
            formData.append('groupId',parseInt(groupId));
            const response = await axios.post(`${url}/chats/upload`,formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            });
            console.log(response);
            if (response?.data) {
                alert(response.data.message);
                 return response.data.chat;
            }
    } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || error.message);
    }

}
async function sendChat(event) {
    const message = event.target.message.value;
   const file = document.getElementById('fileUpload').files[0]; 
    const groupId = sessionStorage.getItem('groupId');
    if(!groupId){
      alert('select group then chat');
      return;
    }
    let data;
  if(file){
 
 const chat =await sendMedia(file,groupId);
  socket.emit('send-chat-message', {
    isFile: true,
    groupId:chat.GroupId,
    senderName: sessionStorage.getItem('userName'),
    fileUrl: chat.fileUrl,
    fileName: chat.fileName,
    fileType: chat.fileType
  });
  }
  if(message.trim().length>0){

 const chat = await sendMessage(message,groupId);
 if(chat){
data={ message:chat.message, groupId:chat.GroupId, senderName: sessionStorage.getItem('userName') }
 socket.emit('send-chat-message', data)
 }
 
 document.getElementById('message').value = '';
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
    // let messages = JSON.parse(sessionStorage.getItem('groupMessages')) || [];
    // let lastMsgId = messages.length > 0 ? messages[messages.length - 1].id : 0;
    // console.log(messages);
    const newMessages = await fetchGroupChats(groupId, 0);
    console.log("newMessages", newMessages);
    // messages = [...messages, ...newMessages];
    const recentMessages = newMessages.slice(-10);

    sessionStorage.setItem('groupMessages', JSON.stringify(recentMessages));
    return recentMessages;
}
 function chatMsg(chat,index){
  const list = document.createElement('li');
        list.innerHTML = `<span class="fw-semibold">${chat.User?.name || chat.senderName}:</span> ${chat.message}`;
        list.classList.add('list-group-item');

        if ((index + 1) % 2 !== 0) {
            list.classList.add('list-group-item-light');
        } else {
            list.classList.add('list-group-item-dark');
        }
        chatList.appendChild(list);
 }
 function chatMedia(chat,index){
    const list=document.createElement('li');
    
    if(chat.fileType.startsWith("image/")){
       list.innerHTML = `
       <span class="fw-semibold mx-2">${chat.User?.name || chat.senderName}:</span>
     <div class="card" style="width: 11rem;">
  <img src="${chat.fileUrl}" class="card-img-top" alt="${chat.fileName}">
</div>`;
    
    }else if(chat.fileType==="application/pdf"){
         list.innerHTML = `
       <span class="fw-semibold mx-2">${chat.User?.name || chat.senderName}:</span>
     <div class="card p-2">
   <p><strong>${chat.fileName}</strong> <i class="fa-solid fa-file-pdf text-danger me-2"></i></p>
    <a href="${chat.fileUrl}" target="_blank" class="btn btn-outline-primary btn-sm">
      View PDF
    </a>
</div>`;
    }else if(chat.fileType==="text/plain" || chat.fileType === "text/csv" || chat.fileType.includes("spredsheet")){
     list.innerHTML = `
     <span class="fw-semibold mx-2">${chat.User?.name || chat.senderName}:</span>
  <div class="card p-2">
    <p><strong>${chat.fileName}</strong>📄</p>
    <a href="${chat.fileUrl}" download class="btn btn-outline-secondary btn-sm">
      Download File
    </a>
  </div>
`;
    }else if(chat.fileType.startsWith("video/")){
        console.log("vedio URL")
     list.innerHTML = `
      <span class="fw-semibold mx-2">${chat.User?.name || chat.senderName}:</span>
    <div class="card p-2">
      <video controls width="70%" style="max-height: 200px;">
        <source src="${chat.fileUrl}" type="${chat.fileType}">
        Your browser does not support the video tag.
      </video>
      <p class="mt-2"><strong>${chat.fileName}</strong></p>
    </div>
  `;
    }

    list.classList.add('list-group-item');
    list.classList.add('d-flex');
      if ((index + 1) % 2 !== 0) {
            list.classList.add('list-group-item-light');
        } else {
            list.classList.add('list-group-item-dark');
        }
        chatList.appendChild(list);
 }
async function showChats(chats) {
    console.log(chats);
    chatList.innerHTML = '';
    chats?.forEach((chat, index) => {
        console.log(chat);
        if(chat.isFile){
            chatMedia(chat,index);
        }else{
            chatMsg(chat,index);
        }
      
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
    selectUserDiv.innerHTML = '';
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
async function createGroup(name, userIds) {
    try {
        const response = await axios.post(`${url}/groups`, {
            name, userIds
        })
        if (response?.data?.message) {
            alert(response.data.message);
            return true;
        }
    } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || error.message);
    }

}
async function handleGroupSubmit(event) {
    event.preventDefault();
    const groupName = event.target.groupName.value;
    // console.log("newform is submitted ",groupName);
    const checkedUsers = [];
    const checkboxes = selectUserDiv.querySelectorAll('input[type="checkbox"]:checked');
    checkboxes.forEach(cb => checkedUsers.push(parseInt(cb.value)));
    // console.log('Selected Users:', checkedUsers);
    if (checkedUsers.length > 0) {
        const isCreated = await createGroup(groupName, checkedUsers);
        console.log("isCreated", isCreated);
        if (isCreated) {
            checkboxes.forEach(cb => cb.checked = false);
            document.getElementById('groupName').value = '';
            showGroups();
        }
    }
}
async function fetchUserGroups() {
    try {
        const response = await axios.get(`${url}/groups/userWithGroups`)
        if (response?.data) {
            return response.data.groups.Groups;
        }
    } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || error.message);
    }
}
async function fetchGroupChats(groupId, lastMsgId) {
    try {
        const response = await axios.get(`${url}/chats/groupChats/${groupId}?lastMsgId=${lastMsgId}`)
        if (response?.data) {
            const chats = response.data.messages;
            return chats;
        }
    } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || error.message);
    }
}
async function showGroups() {
    groupList.innerHTML = '';
    const userGroups = await fetchUserGroups();
    console.log("user unvolved with groups", userGroups);
    userGroups?.forEach((group) => {
        const list = document.createElement('li');
        list.className = 'btn btn-outline-primary mt-1';
        list.setAttribute('groupId', group.id);
        list.innerText = group.name;
        // listener added
        list.addEventListener('click', async () => {
            groupList.querySelectorAll('li').forEach(list => list.classList.remove('active'));
            list.classList.add('active');
             socket.emit('join-group', group.id);
            const chats = await getAllChats(group.id);
            sessionStorage.setItem('groupId', group.id);
            sessionStorage.setItem('groupName', group.name);
            chatHeader.querySelector('h3').innerText = group.name;
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
async function searchUsers() {
    let searchTerm = document.getElementById('searchInput').value;
    let users = await searchUsersByQuery(searchTerm);
    if (users.length === 0) {
        users = await fetchAllUsersExceptMe();
    }
    addInSelectUsers(users);
}
document.getElementById('searchInput')?.addEventListener('input', searchUsers);
document.getElementById('message').addEventListener('input',()=>{
    let message=document.getElementById('message').value;
     if (message.length > 0) {
        document.getElementById('sendButton').removeAttribute('disabled');
    } else {
        document.getElementById('sendButton').setAttribute('disabled', '');
    }
})
document.getElementById('fileUpload').addEventListener('change',()=>{
    let files=document.getElementById('fileUpload').files;
     if (files.length > 0) {
        document.getElementById('sendButton').removeAttribute('disabled');
    } else {
        document.getElementById('sendButton').setAttribute('disabled', '');
    }
})
msgForm.addEventListener('submit', (event) => {
    event.preventDefault();
    sendChat(event);
})
newGroupBtn.addEventListener('click', async () => {
    const users = await fetchAllUsersExceptMe();
    if (users?.length > 0) {
        addInSelectUsers(users);
    }
})
newGroupForm.addEventListener('submit', handleGroupSubmit);
chatHeader.addEventListener('click', () => {
    const groupId = parseInt(sessionStorage.getItem('groupId'));
    if (groupId) {
        console.log(`chatHeader is clicked ${groupId}`);
        window.location.assign('groupDetail.html')
    }
})
document.addEventListener('DOMContentLoaded', () => {
    // setInterval(() => {
    sessionStorage.removeItem('groupId');
    showGroups();
        socket.on('receive-chat-message', (data) => {
                     console.log('📨 New chat received:', data); // <-- Check this in console
                const index = chatList.children.length;
    //             const list = document.createElement('li');
    //             list.innerHTML = `<span class="fw-semibold">${data.senderName}:</span> ${data.message}`;
    //             list.classList.add('list-group-item');
               
    //     if ((index + 1) % 2 !== 0) {
    //         list.classList.add('list-group-item-light');
    //     } else {
    //         list.classList.add('list-group-item-dark');
    //     }
    //             chatList.appendChild(list);
    //             while (chatList.children.length > 10) {
    //     chatList.removeChild(chatList.firstChild);
    // }
      if(data.isFile){
            chatMedia(data,index);
        }else{
            chatMsg(data,index);
        }
                });
    // }, 1000);

});