const form = document.querySelector('form');
const url = '/api/users'

async function signUpUser(event) {
    const name = event.target.name.value;
    const email = event.target.email.value;
    const phone = event.target.phone.value;
    const password = event.target.password.value;
    try {
        const response = await axios.post(`${url}/signup`, {
            name, email, phone, password
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
    signUpUser(event);
})