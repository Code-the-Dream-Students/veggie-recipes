let searchboxFav = document.querySelector("#searchbox-fav");
let currRecipe = "";
let apiURL = './app.json';
let listOfFavoriteRecipes = document.querySelector("#list-of-favorite-recipes");
let recipesInformation = {};
let modalBody = document.querySelector("#modal-content");

const card = (rec) => {
  if (rec.analyzedInstructions.length && rec.extendedIngredients.length) {
    recipesInformation[rec.id] = {
      id: rec.id,
      title: rec.title,
      image: rec.image,
      cookingMinutes: rec.cookingMinutes,
      readyInMinutes: rec.readyInMinutes,
      servings: rec.servings,
      summary: rec.summary,
      steps: rec.analyzedInstructions[0].steps.map(s => s.step),
      ingredients: rec.extendedIngredients.map(i => i.original)
    };
  
    return `
      <div class="col-md-6 col-lg-3 mb-5">
        <div class="card">
          <div style="background-image: url(${rec.image})" class="card-img-top"></div>
          <div class="card-body">
            <h5 class="card-title">${rec.title}</h5>
            <p>${rec.summary.split(" ").slice(0, 50).join(" ")}...</p>
          </div>
          <button id="${rec.id}" onclick="recipeModal(this)" class="btn  my-2" type="submit" data-toggle="modal" data-target="#recipeModal2">Read Recipe</button>
        </div>
      </div>
    `;
  }
  return "";
}

const genRec = (event) => {
  if (event) currRecipe = event.target.value.toLowerCase();
  recipesInformation = {};
  
  listOfFavoriteRecipes.innerHTML = "";
  fetch(apiURL)
  .then(response => response.json())
  .then(data => {
    if (!currRecipe) {
      listOfFavoriteRecipes.innerHTML = data.reduce((acc, rec) => acc += card(rec), "");
    } else {
      listOfFavoriteRecipes.innerHTML = data.reduce((acc, rec) => {
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


let fRecipeTitle = document.querySelector("#f-recipe-title");
let fRecipeTitleH1 = document.querySelector("#f-recipe-title-h1");
let fRecipeImage = document.querySelector("#f-recipe-image");
let fRecipeSummary = document.querySelector("#f-recipe-summary");
let fRecipeCookingMinutes = document.querySelector("#f-recipe-cooking-minutes");
let fRecipeReadyInMinutes = document.querySelector("#f-recipe-ready-in-minutes");
let fRecipeServings = document.querySelector("#f-recipe-servings");
let fRecipeIngredients = document.querySelector("#f-recipe-ingredients");
let fRecipeSteps = document.querySelector("#f-recipe-steps");


const recipeModal = (data) => {
  const recipeInfo = recipesInformation[data.id];
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
};
