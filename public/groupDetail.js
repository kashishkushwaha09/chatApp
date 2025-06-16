const token = localStorage.getItem("token");
const groupId = parseInt(localStorage.getItem('groupId'));
const groupName=localStorage.getItem('groupName');
const membersList = document.getElementById('membersList');
const selectUserDiv = document.getElementById('select-users');
const addUserBtn = document.getElementById('addUserBtn');
const addUsersInGroupForm=document.getElementById('addUsersInGroup');
const url = 'http://localhost:4200/api'
 let userRole='';
if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

async function fetchMembers() {
    try {
        const response = await axios.get(`${url}/groups/groupMembers/${groupId}`)
        console.log(response);
        if (response?.data) {
            return response.data.groupMembers;
        }
    } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || error.message);
    }
}
async function handleRole(member, role) {
    try {
        const response = await axios.put(`${url}/groups/changeRole/${member.id}/${groupId}`, {
            role
        });
        if (response?.data) {
            alert(response.data.message);
             window.location = window.location;
        }
    } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || error.message);
    }
}
async function removeUserFromGroup(member){
     try {
        const response = await axios.delete(`${url}/groups/deleteUserFromGroup/${member.id}/${groupId}`);
        if (response?.data) {
            alert(response.data.message);
             window.location = window.location;
        }
    } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || error.message);
    }
}
async function checkAdmin(){
    try {
         const response = await axios.get(`${url}/groups/checkAdmin/${groupId}`);
         console.log(response);
        if (response?.data) {
           return response.data;
        }
    } catch (error) {
         console.log(error);
        alert(error.response?.data?.message || error.message);
    }
}
async function showMembers() {
    
    document.getElementById('groupName').innerText=`members of ${groupName}`
    if(userRole.role==='admin'){
        document.getElementById('addUserBtn').style.display='block';
 document.getElementById('addUserBtn').innerText=`Add Users in ${groupName}`
    }else{
        document.getElementById('addUserBtn').style.display='none';
    }
   
    membersList.innerHTML = '';
    const groupMembers = await fetchMembers();
    const userId = localStorage.getItem('userId');
   
   
    if (groupMembers) {
        for (const member of groupMembers) {
            console.log("members of group ", member.User.id);
            const list = document.createElement('li');
            list.className = 'btn btn-outline-primary mt-1';
            list.innerText = member.User.id == userId ? "You" : member.User.name;
            if (member.User.id != userId && userRole.role==='admin') {
                console.log(member);

                list.setAttribute('data-bs-toggle', 'modal');
                list.setAttribute('data-bs-target', '#exampleModal')
                list.addEventListener('click', () => {
                    document.querySelector('.modal-title').innerText = member.User.name;
                    const groupMember = document.getElementById('groupMember');
                    groupMember.innerHTML='';
                    let makeAdminOrRemove = document.createElement('li');
                    makeAdminOrRemove.style.cursor='pointer';
                    if (member.role === 'admin') {
                        makeAdminOrRemove.innerText = 'Dismiss as admin';
                        makeAdminOrRemove.addEventListener('click', () => handleRole(member, "member"));
                    } else {
                        makeAdminOrRemove.innerText = 'Make group admin';
                        makeAdminOrRemove.addEventListener('click', () => handleRole(member, "admin"));
                    }
                    makeAdminOrRemove.className = 'list-group-item';
                    groupMember.appendChild(makeAdminOrRemove);
                    let removeMember = document.createElement('li');
                    removeMember.className = 'list-group-item';
                    removeMember.innerText = 'Remove User from group';
                    removeMember.style.cursor='pointer';
                    removeMember.addEventListener('click', () => removeUserFromGroup(member));
                    groupMember.appendChild(removeMember);
                })
            }

            membersList.appendChild(list);
        }
    }

}
async function fetchUsersNotInGroup() {
    try {
        const response = await axios.get(`${url}/groups/usersNotInGroup/${groupId}`);
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
async function addUsersInGroup(userIds){
  try {
        const response = await axios.post(`${url}/groups/addUsersInGroup/${groupId}?userIds=${userIds}`);
        if (response?.data) {
            alert(response.data.message);
             window.location = window.location;
        }
    } catch (error) {
        console.log(error);
        alert(error.response?.data?.message || error.message);
    }
}

async function handleFormSubmit(event){
event.preventDefault();
const checkedUsers = [];
const checkboxes=selectUserDiv.querySelectorAll('input[type="checkbox"]:checked');
checkboxes.forEach(cb => checkedUsers.push(parseInt(cb.value)));
    // console.log('Selected Users:', checkedUsers);
    if(checkedUsers.length>0){
        const isCreated=await addUsersInGroup(checkedUsers);
        console.log("isCreated",isCreated);
        if(isCreated){
            checkboxes.forEach(cb =>cb.checked=false);
            document.getElementById('groupName').value='';
             showGroups();
        }
    }
}
async function searchUsersByQuery(searchTerm) {
     try {
        const response = await axios.get(`${url}/groups/usersNotInGroup/${groupId}?query=${searchTerm}`);
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
            users=await fetchUsersNotInGroup();
        }
      addInSelectUsers(users);
}
document.getElementById('searchInput')?.addEventListener('input',searchUsers);
addUserBtn.addEventListener('click', async () => {
    const users = await fetchUsersNotInGroup();
    if (users?.length > 0) {
        addInSelectUsers(users);
    }
})
addUsersInGroupForm.addEventListener('submit',handleFormSubmit);
document.addEventListener('DOMContentLoaded', async() => {
 userRole=await checkAdmin();
      console.log(userRole);
    showMembers();

});

