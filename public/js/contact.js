const fields = document.querySelector("#fields");
const updateName = document.querySelector("#update-name");
const updateEmail = document.querySelector("#update-email");
const updateOldPassword = document.querySelector("#update-old-password");
const updateNewPassword = document.querySelector("#update-new-password");
const updateUserForm = document.getElementById('updateUser');
const buttonRecipeFavorite = document.getElementById("saveRecipeBtn");
const recipeModal = document.getElementById('recipeModal2');
const oldPasswordMessage = document.getElementById('oldPasswordMessage');
const newPasswordMessage = document.getElementById('newPasswordMessage');
const newEmailMessage = document.getElementById('newEmailMessage');
const newUserNameMessage = document.getElementById('newUserNameMessage');
const updateModal = document.getElementById('updateModal');
const updateUserSuccessMessage = document.getElementById('updateUserSuccessMessage');
const recipeSaveModalMessage = document.getElementById('recipeSaveModalMessage');

function myFunction() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

const toggling = () => {
    let toggle = true;  
    return () => {
      toggle = !toggle
      updateName.readOnly = 
      updateEmail.readOnly = 
      updateOldPassword.readOnly = 
      updateNewPassword.readOnly = toggle;
  
      if (toggle) {
        event.target.textContent = "Enable fields";
        event.target.classList.replace("btn-danger", "btn-primary");
      } else {
        event.target.textContent = "Disable fields";
        event.target.classList.replace("btn-primary", "btn-danger");
      }
    };
  }
  
  const enableDisable = toggling();
  
  const buttonChange = (event) => {
    event.preventDefault();
    enableDisable();
  }
  
  fields.addEventListener("click", buttonChange)

// update user modal
updateUserForm.addEventListener('submit', async (event) => {
    try {
      event.preventDefault();
  
      let formData = new FormData(updateUserForm);
  
      const data = {
          'userName': formData.get('userName'),
          'email': formData.get('email'),
          'oldPassword': formData.get('oldPassword'),
          'password': formData.get('newPassword')
      };
      
        const res = await fetch('/updateUser', {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        });
  
        let message = await res.json();
        
        if (message.type === 'unsuccessfulOld') {
          oldPasswordMessage.classList.replace('hide', 'unsuccessful');
          oldPasswordMessage.innerHTML = `${message.message}`;
        } else if (message.type === 'unsuccessfulNew') {
          newPasswordMessage.classList.replace('hide', 'unsuccessful');
          newPasswordMessage.innerHTML = `${message.message}`;
        } else if (message.type === 'unsuccessfulEmail') {
            newEmailMessage.classList.replace('hide', 'unsuccessful');
            newEmailMessage.innerHTML = `${message.message}`;
        } else if (message.type === 'unsuccessfulUserName') {
            newUserNameMessage.classList.replace('hide', 'unsuccessful');
            newUserNameMessage.innerHTML = `${message.message}`;
        } else if (message.type === 'unsuccessfulDuplicateEmail')  {
            updateUserForm.classList.add('hide');
          updateUserSuccessMessage.classList.replace('successful', 'unsuccessful');
          updateUserSuccessMessage.classList.remove('hide');
          updateUserSuccessMessage.innerHTML = `${message.message}`;
        } else {
          updateUserForm.classList.add('hide');
          updateUserSuccessMessage.classList.remove('hide');
          updateUserSuccessMessage.innerHTML = `${message.message}`;
        }
  
    } catch (e) {
        console.log(e.message);
    }
  })
  
  // Reset update user label after modal closes
  $(updateModal).on('hidden.bs.modal', function () {
    if (oldPasswordMessage.classList.contains('unsuccessful')) {
      oldPasswordMessage.classList.replace('unsuccessful','hide')
    }
  
    if (newPasswordMessage.classList.contains('unsuccessful')) {
      newPasswordMessage.classList.replace('unsuccessful','hide')
    }

    if (newEmailMessage.classList.contains('unsuccessful')) {
        newEmailMessage.classList.replace('unsuccessful','hide')
    }

    if (newUserNameMessage.classList.contains('unsuccessful')) {
        newUserNameMessage.classList.replace('unsuccessful','hide')
    }
  
    if (updateUserForm.classList.contains('hide')) {
      updateUserForm.classList.remove('hide');
    }
    
    updateUserSuccessMessage.classList.add('hide')
    updateUserSuccessMessage.classList.add('successful')
    updateUserSuccessMessage.classList.remove('unsuccessful')
  })