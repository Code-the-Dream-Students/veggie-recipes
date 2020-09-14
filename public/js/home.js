
// let apiURL = './app.json';

let currRecipe;
const searchboxFav = document.querySelector("#searchbox-fav");
const listOfFavoriteRecipes = document.querySelector("#list-of-favorite-recipes");
const fRecipeTitle = document.querySelector("#f-recipe-title");
const fRecipeTitleH1 = document.querySelector("#f-recipe-title-h1");
const fRecipeImage = document.querySelector("#f-recipe-image");
const fRecipeSummary = document.querySelector("#f-recipe-summary");
const fRecipeCookingMinutes = document.querySelector("#f-recipe-cooking-minutes");
const fRecipeReadyInMinutes = document.querySelector("#f-recipe-ready-in-minutes");
const fRecipeServings = document.querySelector("#f-recipe-servings");
const fRecipeIngredients = document.querySelector("#f-recipe-ingredients");
const fRecipeSteps = document.querySelector("#f-recipe-steps");
const emailRecipeBtn = document.getElementById('emailRecipeBtn');
let recipesInformationGlobal = {};
let recipesInformation = [];
let recipeInfo;

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
const emailRecipeModalMessage = document.getElementById('emailRecipeMessage');
const emailRecipeModal = document.getElementById('emailRecipeModal');
const recipeSaveModalMessage = document.getElementById('recipeSaveModalMessage');


// updateName.value = information.name;
// updateEmail.value = information.email;

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



function myFunction() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

const card = (rec) => {
    return `
    <div class="col-md-6 col-lg-3 mb-5">
      <div class="card">
        <div style="background-image: url(${rec.image})" class="card-img-top"></div>
        <div class="card-body">
          <h5 class="card-title">${rec.title}</h5>
          <p>${rec.summary.split(" ").slice(0, 50).join(" ")}...</p>
        </div>
        <button id="${rec.id}" onclick="displayRecipeModal(${rec.id})" class="btn  my-2" type="submit" data-toggle="modal" data-target="#recipeModal2">Read Recipe</button>
      </div>
    </div>
  `;
}


const genRec = (event) => {
  if (event) currRecipe = event.target.value.toLowerCase();
  
  listOfFavoriteRecipes.innerHTML = "";
  fetch('/getFavoriteRecipes')
  .then(response => response.json())
  .then(recipes => {
    recipesInformation = recipes;
    recipes.forEach(recipe => {
        recipesInformationGlobal[recipe.id] = recipe;
    })

    if (!currRecipe) {
      listOfFavoriteRecipes.innerHTML = recipesInformation.reduce((acc, rec) => acc += card(rec), "");
    } else {
      listOfFavoriteRecipes.innerHTML = recipesInformation.reduce((acc, rec) => {
        if (rec.title.toLowerCase().includes(currRecipe) && currRecipe) {
          return acc += card(rec);
        }
        return acc; 
      }, "");
    }
  });
}
genRec();
searchboxFav.addEventListener("keyup", (event) => genRec(event));


const displayRecipeModal = (id) => {
  recipeInfo = recipesInformationGlobal[id];
  recipeInfo.favorite = true;
  const { title, image, summary, cookingMinutes, readyInMinutes, servings, ingredients, steps, favorite } = recipeInfo;


  buttonRecipeFavorite.innerHTML = `
    <img 
      class="false" 
      height="50px" 
      width="50px" 
      id="f${id}" 
      src="${favorite ? './images/heart2.png' : './images/heart1.png'}">
  `; 

        fRecipeTitle.innerHTML = title;
        fRecipeTitleH1.innerHTML = title;
        fRecipeImage.setAttribute("src", image);
        fRecipeSummary.innerHTML = summary;
        fRecipeCookingMinutes.innerHTML = cookingMinutes ? cookingMinutes : readyInMinutes;
        fRecipeReadyInMinutes.innerHTML = readyInMinutes;
        fRecipeServings.innerHTML = servings;
        fRecipeIngredients.innerHTML = ingredients.reduce((acc, ingredient) => acc += `<li>${ingredient}</li>`,"");
        fRecipeSteps.innerHTML = steps.reduce((acc, step) => acc += `<li>${step}</li>`,"");
    
};
// Rerender recipes after modal closes
$(recipeModal).on('hidden.bs.modal', function (e) {
  genRec();
})

// Save recipe modal button
emailRecipeBtn.addEventListener('click', async () => {
  try {
      const res = await fetch('/emailRecipe', {
          method: 'POST',
          body: JSON.stringify(recipeInfo),
          headers: {'Content-Type': 'application/json'}
      });
      let message = await res.json();
      console.log('hello')
      emailRecipeModalMessage.innerHTML = `${message.message}`;
      $('#emailRecipeModal').modal('show');

  } catch (e) {
      console.log(e.message);
  }
})

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

// Save recipe modal button
buttonRecipeFavorite.addEventListener('click', async () => {
  try {
      const res = await fetch('/saveRecipe', {
          method: 'POST',
          body: JSON.stringify(recipeInfo),
          headers: {'Content-Type': 'application/json'}
      });
      let data = await res.json();
      // recipesInformation = data.recipes;
      
      if (recipeInfo.favorite) {
        recipeInfo.favorite = false;
      } else {
        recipeInfo.favorite = true;
      }

      buttonRecipeFavorite.innerHTML = `
        <img 
          class="false" 
          height="50px" 
          width="50px" 
          src="${data.saved ? './images/heart2.png' : './images/heart1.png'}"
        >`; 
      
        recipeSaveModalMessage.innerHTML = `${data.message}`;
        $('#emailRecipeModal').modal('show')

  } catch (e) {
      console.log(e.message);
  }
})

const forgotPasswordForm = document.getElementById('forgotPassword');
const forgotPasswordMessage = document.getElementById('forgotPasswordMessage');
const forgotPasswordDiv = document.getElementById('forgotPasswordDiv');
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');

// Save recipe modal button
forgotPasswordForm.addEventListener('submit', async (event) => {
  try {
    event.preventDefault();

    let formData = new FormData(forgotPasswordForm);

    const data = {
        'email': formData.get('email')
    };
      
      const res = await fetch('/forgotPassword', {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {'Content-Type': 'application/json'}
      });

      let message = await res.json();
      
      forgotPasswordMessage.classList.remove('hide')

      if (message.type === 'success') {
        forgotPasswordMessage.classList.add('successful')
        forgotPasswordDiv.classList.add('hide');
        forgotPasswordBtn.classList.add('hide');
      } else {
        forgotPasswordMessage.classList.add('unsuccessful')
      }
      forgotPasswordMessage.innerHTML = `${message.message}`;
      

  } catch (e) {
      console.log(e.message);
  }
})

// Reset forgot password input after modal closes
$(forgotPasswordModal).on('hidden.bs.modal', function () {
  forgotPasswordDiv.classList.remove('hide');
  forgotPasswordBtn.classList.remove('hide');
  forgotPasswordMessage.classList.add('hide')

  if (forgotPasswordMessage.classList.contains('successful')) {
    forgotPasswordMessage.classList.remove('successful')
  } else {
    forgotPasswordMessage.classList.remove('unsuccessful')
  }
})