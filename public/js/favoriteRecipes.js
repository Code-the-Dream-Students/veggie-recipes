
// let apiURL = './app.json';

let currRecipe;
let searchboxFav = document.querySelector("#searchbox-fav");
let listOfFavoriteRecipes = document.querySelector("#list-of-favorite-recipes");
let fRecipeTitle = document.querySelector("#f-recipe-title");
let fRecipeTitleH1 = document.querySelector("#f-recipe-title-h1");
let fRecipeImage = document.querySelector("#f-recipe-image");
let fRecipeSummary = document.querySelector("#f-recipe-summary");
let fRecipeCookingMinutes = document.querySelector("#f-recipe-cooking-minutes");
let fRecipeReadyInMinutes = document.querySelector("#f-recipe-ready-in-minutes");
let fRecipeServings = document.querySelector("#f-recipe-servings");
let fRecipeIngredients = document.querySelector("#f-recipe-ingredients");
let fRecipeSteps = document.querySelector("#f-recipe-steps");
let recipesInformationGlobal = {};
let recipesInformation = [];

const card = (rec) => {
    return `
    <div class="col-md-6 col-lg-3 mb-5">
      <div class="card">
        <div style="background-image: url(${rec.image})" class="card-img-top"></div>
        <div class="card-body">
          <h5 class="card-title">${rec.title}</h5>
          <p>${rec.summary.split(" ").slice(0, 50).join(" ")}...</p>
        </div>
        <button id="${rec.id}" onclick="recipeModal(${rec.id})" class="btn  my-2" type="submit" data-toggle="modal" data-target="#recipeModal2">Read Recipe</button>
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


const recipeModal = (id) => {
    // recipesInformation = {}
    // fetch('/getFavoriteRecipes')
    // .then(response => response.json())
    // .then((recipes) => {
    //     console.log(recipes)
    //     recipes.forEach(recipe => {
    //         recipesInformation[recipe.id] = recipe;
    //     })

        const recipeInfo = recipesInformationGlobal[id];
        const { title, image, summary, cookingMinutes, readyInMinutes, servings, ingredients, steps } = recipeInfo;
        fRecipeTitle.innerHTML = title;
        fRecipeTitleH1.innerHTML = title;
        fRecipeImage.setAttribute("src", image);
        fRecipeSummary.innerHTML = summary;
        fRecipeCookingMinutes.innerHTML = cookingMinutes ? cookingMinutes : readyInMinutes;
        fRecipeReadyInMinutes.innerHTML = readyInMinutes;
        fRecipeServings.innerHTML = servings;
        fRecipeIngredients.innerHTML = ingredients.reduce((acc, ingredient) => acc += `<li>${ingredient}</li>`,"");
        fRecipeSteps.innerHTML = steps.reduce((acc, step) => acc += `<li>${step}</li>`,"");
    // })
};