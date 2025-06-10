const form = document.querySelector('form');
const url = 'http://localhost:4200/api/users'

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
       console.log(error.message);
       alert(`Something went wrong`);
    }

}
form.addEventListener('submit', (event) => {
    event.preventDefault();
    signUpUser(event);
})