const form = document.querySelector('form');
const url = 'http://localhost:4200/api/users'

async function loginUser(event) {
  
    const email = event.target.email.value;
    const password = event.target.password.value;
    try {
        const response = await axios.post(`${url}/login`, {
            email,password
        })
        console.log(response);
        if (response?.data) {
            if(response.data){
                localStorage.setItem('token',response.data.token);
                localStorage.setItem('userId',response.data.user.id);
                localStorage.setItem('userName',response.data.user.name);
                window.location.assign('chat.html');
        //   axios.defaults.headers.common['Authorization']=`Bearer ${response.data.token}`;
         }
            alert(response.data.message);
        }
    } catch (error) {
       console.log(error);
       alert(error.response?.data?.message || error.message);
    }

}
form.addEventListener('submit', (event) => {
    event.preventDefault();
    loginUser(event);
})