// const { AppError } = require("../utils/appError");

const token=localStorage.getItem("token");
const form = document.querySelector('form');
const url = 'http://localhost:4200/api/chats'

if(token){
    axios.defaults.headers.common['Authorization']=`Bearer ${token}`;
}

async function addMessage(event){
    const message=event.target.message.value;
    console.log(message);
    try {
         const response=await axios.post(`${url}`, {
           message
        })
         console.log(response);
        if (response?.data) {
            alert(response.data.message);
        }
    } catch (error) {
        console.log(error);
       alert(error.response?.data?.message || error.message);
    }
   
}
async function fetchChats() {
    try {
        const response=await axios.get(`${url}`);
        console.log(response);
        return response.data.chats;
    } catch (error) {
        console.log(error);
       alert(error.response?.data?.message || error.message);
    }
}
async function showChats(){
    const chatList=document.querySelector('.list-group');
    chatList.innerHTML='';
   const chats=await fetchChats();
   console.log(chats);
   chats.forEach((chat,index) => {
    const list=document.createElement('li');
    list.innerText=chat.message;
    list.classList.add('list-group-item');
    if((index+1)%2!==0){
     list.classList.add('list-group-item-light');   
    }else{
      list.classList.add('list-group-item-dark');    
    }
    chatList.appendChild(list);
   });
}
form.addEventListener('submit', (event) => {
    event.preventDefault();
    addMessage(event);
})
document.addEventListener('DOMContentLoaded',()=>{
    setInterval(() => {
         showChats();
    }, 1000);
   
});