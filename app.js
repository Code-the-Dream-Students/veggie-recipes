/* Toggle between showing and hiding the navigation menu links when the user clicks on the hamburger menu / bar icon */
function myFunction() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

let test1 = "./app.json";

let recipe = "";
let cuisine = "";
let type = "";

let listOfRecipes = document.querySelector("#list-of-recipes");
let searchbox = document.querySelector("#searchbox");
let generateRecipesButton = document.querySelector("#generate-recipes");
let modalBody = document.querySelector(".modal-body");
let modalButton = document.querySelector("#modal-button");
let modalTitle = document.querySelector(".modal-title");
let cuisines = ["african", "american", "british", "cajun", "caribbean", "chinese", "eastern european", "european", "french", "german", "greek", "indian", "irish", "italian", "japanese", "jewish", "korean", "latin american", "mediterranean", "mexican", "middle eastern", "nordic", "southern", "spanish", "thai", "vietnamese"];
let types = ["main course", "side dish", "dessert", "appetizer", "salad", "bread", "breakfast", "soup", "beverage", "sauce", "marinade", "fingerfood", "snack", "drink"];
let cuisinesSelect = document.querySelector("#cuisines");
let typesSelect = document.querySelector("#types");
let recipesInformation = {};
// let apiKey = "c0c4732f3def410180ec614935768041";
let apiKey = "5c2bbde5c4f847dca86facba65aa4231";

const generateCuisines = () => {
  cuisinesSelect.innerHTML = `<option onclick="cuisine = ''"></option>`;
  cuisinesSelect.innerHTML += cuisines.reduce((acc, cui) => acc += `<option onclick="cuisine = this.value">${cui}</option>`, "");
};
generateCuisines();

const generateTypes = () => {
  typesSelect.innerHTML = `<option "onclick="type = ''"></option>`;
  typesSelect.innerHTML += types.reduce((acc, type) => acc += `<option onclick="type = this.value">${type}</option>`, "");
};
generateTypes();

searchbox.addEventListener("keyup", (event) => recipe = event.target.value.toLowerCase());

const generateRecipes = () => {
  if (recipe.length >= 3 || cuisine || type) {
    listOfRecipes.innerHTML = "";
    recipesInformation = {};
    fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&diet=vegetarian&number=1&query=${recipe}&cuisine=${cuisine}&type=${type}`)
    .then(response => response.json())
    .then(data => {
      data.results.forEach(rec => {
        displayRecipes(rec);        
      })
    })
  }
}; 

const displayRecipes = (rec) => {
  fetch(`https://api.spoonacular.com/recipes/${rec.id}/information?apiKey=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    if (data.analyzedInstructions.length && data.extendedIngredients.length) {
      recipesInformation[data.id] = {
        title: data.title,
        readyInMinutes: data.readyInMinutes,
        servings: data.servings,
        summary: data.summary,
        steps: data.analyzedInstructions[0].steps.map(s => s.step),
        ingredients: data.extendedIngredients.map(i => i.original)
      }
      listOfRecipes.innerHTML += `
        <div class="box">
          <img src="${data.image}" alt="${data.image}">
          <h4>${data.title}</h4>
          <p>${data.summary.split(" ").slice(0, 50).join(" ")}...</p>
          <button id="${data.id}" onclick="recipeModal(this)">Read more</button>
        </div>
      `;
      console.log(recipesInformation)
    }
  })
};

generateRecipesButton.addEventListener("click", generateRecipes);

const recipeModal = (data) => {
  const recipeInfo = recipesInformation[data.id];
  modalTitle.textContent = recipeInfo.title;
  modalBody.innerHTML = `
    <p>Ready in: ${recipeInfo.readyInMinutes} minutes<p>
    <p>Servings: ${recipeInfo.servings}<p>
    <p>Summary: ${recipeInfo.summary}<p>
    <p>Ingredients</p>  
    <ul>
      ${recipeInfo.ingredients.reduce((acc, ingredient) => acc += `<li>${ingredient}</li>`,"")}
    </ul>
    <p>Steps</p>
    <ul>
      ${recipeInfo.steps.reduce((acc, step) => acc += `<li>${step}</li>`,"")}
    </ul>
  `;
  modalButton.click();
};

// generateRecipes.addEventListener("click", () => genRecipe(searchbox.value))

// function genRecipe (recipe) {
//   if (recipe.length >= 3) {
//     fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${recipe}&diet=vegetarian&number=2`)
//       .then(response => response.json())
//       .then(data => {
//         console.log(data)
//         data.results.forEach(rec => {
//           fetch(`https://api.spoonacular.com/recipes/${rec.id}/information?apiKey=${apiKey}`)
//             .then(res => res.json())
//             .then(d => {
//               console.log(d);
//             })
//         })  
//       })
//       .catch(err => console.error("Error: ", err));
//   } else {
//     alert("3 characters minimum")
//   }
// }

// function genCuisines (cuisine) {
//   if (!searchbox.value) {
//     fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&diet=vegetarian&number=5&cuisine=${cuisine}`)
//       .then(response => response.json())
//       .then(data => {
//         console.log(data);
//       })
//   }
// }

// function genTypes (type) {
//   if (!searchbox.value) {
//     fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&diet=vegetarian&number=5&type=${type}`)
//       .then(response => response.json())
//       .then(data => {
//         console.log(data);
//       })
//   }
// }

// generateRecipes.addEventListener("click", test);

// function test () {
//   fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&diet=vegetarian&number=2&query=curry&cuisine=&type=`)
//     .then(response => response.json())
//     .then(data => {
//       console.log(data);
//     })
// }


// searchbox.addEventListener("keyup", (event) => {
//   recipe = event.target.value.toLowerCase();
//   listOfRecipes.innerHTML = "";
//   cuisinesSelect.innerHTML = `<option>Choose...</option>`;
//   typesSelect.innerHTML = `<option>Choose...</option>`;
  
//   fetch(test1)
//   .then(response => response.json())
//   .then(data => {
//     data.forEach(rec => {
//       if (rec.title.toLowerCase().includes(recipe) && recipe) {
//         listOfRecipes.innerHTML += `
//           <div class="box">
//             <img src="${rec.image}" alt="${rec.image}">
//             <h4>${rec.title}</h4>
//             <p>${rec.summary.split(" ").slice(0, 50).join(" ")}...</p>
//             <button>Read more</button>
//           </div>
//         `;
        
//         rec.cuisines.forEach(cui => {
//           if (cuisines.includes(cui.toLowerCase())) {
//             cuisinesSelect.innerHTML += `<option>${cui}</option>`;
//           }  
//         })

//         rec.dishTypes.forEach(type => {
//           if (types.includes(type.toLowerCase())) {
//             typesSelect.innerHTML += `<option>${type}</option>`;
//           }  
//         })

//       } else if (!recipe) {
//         generateCuisines();
//         generateTypes();
//       }
//     });
//   });
// });


// generateRecipes.addEventListener("click", () => {
//   // fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${recipe}&diet=vegetarian&number=20&cuisine=indian&type=dessert`)
//   fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&diet=vegetarian&number=20&cuisine=indian`)
//     .then(response => response.json())
//     .then(data => {
//       console.log(data);
//       // data.results.forEach(rec => {
//       //   fetch(`https://api.spoonacular.com/recipes/${rec.id}/information`)
//       //     .then(res => res.json())
//       //     .then(d => {
//       //       console.log(d);
//       //     })
//       // })  
//     })
// })
