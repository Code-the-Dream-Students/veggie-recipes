let recipe = "";
let cuisine = "";
let type = "";
const searchRecipesForm = document.getElementById('searchRecipes');
const listOfRecipes = document.querySelector("#list-of-recipes");
const searchbox = document.querySelector("#searchbox");
const generateRecipesButton = document.querySelector("#generate-recipes");
const modalBody = document.querySelector(".modal-content");
const modalButton = document.querySelector("#modal-button");
const modalTitle = document.querySelector(".modal-title");
const cuisines = ["african", "american", "british", "cajun", "caribbean", "chinese", "eastern european", "european", "french", "german", "greek", "indian", "irish", "italian", "japanese", "jewish", "korean", "latin american", "mediterranean", "mexican", "middle eastern", "nordic", "southern", "spanish", "thai", "vietnamese"];
const types = ["main course", "side dish", "dessert", "appetizer", "salad", "bread", "breakfast", "soup", "beverage", "sauce", "marinade", "fingerfood", "snack", "drink"];
const cuisinesSelect = document.querySelector("#cuisines");
const typesSelect = document.querySelector("#types");
let recipesInformation = {};
let recipesForCarrousel = [];


function myFunction() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}



const generateCuisines = () => {
  cuisinesSelect.innerHTML = `<option onclick="cuisine = ''">Cuisine</option>`;
  cuisinesSelect.innerHTML += cuisines.reduce((acc, cui) => acc += `<option value=${cui} onclick="cuisine = this.value">${cui}</option>`, "");
};
generateCuisines();

const generateTypes = () => {
  typesSelect.innerHTML = `<option "onclick="type = ''">Type</option>`;
  typesSelect.innerHTML += types.reduce((acc, type) => acc += `<option value=${type} onclick="type = this.value">${type}</option>`, "");
};
generateTypes();

searchbox.addEventListener("keyup", (event) => recipe = event.target.value.toLowerCase());

generateRecipesButton.addEventListener("click", async (e) => {
    e.preventDefault();

    let formData = new FormData(searchRecipesForm);

    const data = {
        'query': formData.get('query'),
        'cuisine': formData.get('cuisine'),
        'type': formData.get('type')
    };

    try {
        const res = await fetch('/search', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        });
        let recipes = await res.json();

        recipes.forEach(recipe => {
          recipesInformation[recipe.id] = recipe;
        })

        recipesForCarrousel = []; 

        generateRecipes(recipes)
        
    } catch (e) {
        console.log(e.message);
    }
});

const displayRecipes = (rec) => {
    recipesForCarrousel.push(recipesInformation[rec.id]);
    
    let summary = rec.summary.split(" ").slice(0, 40).join(" ");
    summary = summary.replace(/(<\/?b>)/g,"")

    listOfRecipes.innerHTML += `
          <div class="col-md-6 col-lg-3 mb-5">
            <div class="card">
              <div style="background-image: url(${rec.image})" class="card-img-top"></div>
              <div class="card-body">
                <h5 class="card-title">${rec.title}</h5>
                <p class="card-text">${summary}...</p>
              </div>
              <button id="${rec.id}" onclick="recipeModal(this)" class="btn  my-2" type="submit" data-toggle="modal" data-target="#recipeModal">Read Recipe</button>
            </div>
          </div>
        `;
};


const generateRecipes = (recipes) => {
  listOfRecipes.innerHTML = '';
  if (recipes[0].notFound) {
    listOfRecipes.innerHTML += '<div>There are not recipes for your search! Please modify your search to see recipes.</div>';
    return;
  }
  recipes.forEach(rec => {
    displayRecipes(rec);        
  })
}; 

let recipeInfo;
const recipeTitle = document.querySelector("#recipe-title");
const recipeTitleH1 = document.querySelector("#recipe-title-h1");
const recipeImage = document.querySelector("#recipe-image");
const recipeSummary = document.querySelector("#recipe-summary");
const recipeCookingMinutes = document.querySelector("#recipe-cooking-minutes");
const recipeReadyInMinutes = document.querySelector("#recipe-ready-in-minutes");
const recipeServings = document.querySelector("#recipe-servings");
const recipeIngredients = document.querySelector("#recipe-ingredients");
const recipeSteps = document.querySelector("#recipe-steps");
const optionalRecipes1 = document.querySelector("#optional-recipes1");
const optionalRecipes2 = document.querySelector("#optional-recipes2");
const secondCarouselLi = document.getElementById('secondCarouselLi');
const recipeCarousel = document.getElementById('recipeCarousel');
const carouselItem = document.getElementById('carouselItem');
const disposableCarouselItem = document.getElementById('disposableCarouselItem');
const nondisposableCarouselItem = document.getElementById('nondisposableCarouselItem');


// const favfav = (something) => {
//   let fav = recipesInformation[something.split("f")[1]];
//   fav.favorite = !fav.favorite;
//   recipeModal(fav);
// }


const recipeModal = (data) => {
  recipeInfo = recipesInformation[data.id];
  const { title, image, summary, cookingMinutes, readyInMinutes, servings, ingredients, steps, favorite } = recipeInfo;
  
  buttonRecipeFavorite.innerHTML = `
    <img 
      class="false" 
      height="50px" 
      width="50px" 
      id="f${data.id}" 
      src="${favorite ? './images/heart2.png' : './images/heart1.png'}">
  `;  
  recipeTitle.innerHTML = title;
  recipeTitleH1.innerHTML = title;
  recipeImage.setAttribute("src", image);
  recipeSummary.innerHTML = summary;
  recipeCookingMinutes.innerHTML = cookingMinutes ? cookingMinutes : readyInMinutes;
  recipeReadyInMinutes.innerHTML = readyInMinutes;
  recipeServings.innerHTML = servings;
  recipeIngredients.innerHTML = ingredients.reduce((acc, ingredient) => acc += `<li>${ingredient}</li>`,"");
  recipeSteps.innerHTML = steps.reduce((acc, step) => acc += `<li>${step}</li>`,"");
  optionalRecipes1.innerHTML = generateOptionalRecipes(0, 4);
  // optionalRecipes2.innerHTML = generateOptionalRecipes(4, 8); 
  if (recipesForCarrousel.length > 4) {
    optionalRecipes2.innerHTML = generateOptionalRecipes(4, 8);
    // disposableCarouselItem.classList.add('carousel-item'); 
    // disposableCarouselItem.classList.remove('d-none');
    disposableCarouselItem.classList.replace('d-none', 'carousel-item');
    nondisposableCarouselItem.classList.remove('active')
  } else {
    // disposableCarouselItem.classList.remove('carousel-item'); 
    // disposableCarouselItem.classList.add('d-none');
    disposableCarouselItem.classList.replace('carousel-item', 'd-none');
    nondisposableCarouselItem.classList.add('active')
  }
  
};

const generateOptionalRecipes = (num1, num2) => {
  return recipesForCarrousel.slice(num1, num2).reduce((acc, rec) => {
    return acc += `
      <div id="${rec.id}" style="cursor: pointer" onclick="recipeModal(this)" class="col-lg-3 col-md-6 col-sm-6">
        <div class="similar-recipe">
          <div class="pic">
            <img class="img-responsive" src="${rec.image}" alt="">
          </div>
          <div class="recipe-content">
            <h3 class="title">${rec.title}</h3>
          </div>
        </div>
      </div>
    `;
  }, "")
}


const fields = document.querySelector("#fields");
const updateName = document.querySelector("#update-name");
const updateEmail = document.querySelector("#update-email");
const updateOldPassword = document.querySelector("#update-old-password");
const updateNewPassword = document.querySelector("#update-new-password");
const updateUserForm = document.getElementById('updateUser');
const buttonRecipeFavorite = document.getElementById("saveRecipeBtn");

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
      console.log(data.message)

  } catch (e) {
      console.log(e.message);
  }
})

// Save recipe modal button
updateUserForm.addEventListener('submit', async (event) => {
  try {
    event.preventDefault();

    let formData = new FormData(updateUserForm);

    const data = {
        'userName': formData.get('userName'),
        'email': formData.get('email'),
        'password': formData.get('newPassword')
    };
    
      const res = await fetch('/updateUser', {
          method: 'PATCH',
          body: JSON.stringify(data),
          headers: {'Content-Type': 'application/json'}
      });

      let updatesMade = await res.json();

      console.log(updatesMade)

  } catch (e) {
      console.log(e.message);
  }
})

