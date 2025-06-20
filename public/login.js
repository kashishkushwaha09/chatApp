const form = document.querySelector('form');
const url = '/api/users'
 
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
                sessionStorage.setItem('token',response.data.token);
                sessionStorage.setItem('userId',response.data.user.id);
                sessionStorage.setItem('userName',response.data.user.name);
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