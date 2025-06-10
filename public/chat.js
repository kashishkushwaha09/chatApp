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
form.addEventListener('submit', (event) => {
    event.preventDefault();
    addMessage(event);
})