function myFunction() {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
}

let recipe = "";
let cuisine = "";
let type = "";

let listOfRecipes = document.querySelector("#list-of-recipes");
let searchbox = document.querySelector("#searchbox");
let generateRecipesButton = document.querySelector("#generate-recipes");
let modalBody = document.querySelector("#modal-body");
let modalTitle = document.querySelector(".modal-title");
let cuisines = ["african", "american", "british", "cajun", "caribbean", "chinese", "eastern european", "european", "french", "german", "greek", "indian", "irish", "italian", "japanese", "jewish", "korean", "latin american", "mediterranean", "mexican", "middle eastern", "nordic", "southern", "spanish", "thai", "vietnamese"];
let types = ["main course", "side dish", "dessert", "appetizer", "salad", "bread", "breakfast", "soup", "beverage", "sauce", "marinade", "fingerfood", "snack", "drink"];
let cuisinesSelect = document.querySelector("#cuisines");
let typesSelect = document.querySelector("#types");
let recipesInformation = {};
let recipesForCarrousel = [];
let apiKey = "c0c4732f3def410180ec614935768041";
// let apiKey = "5c2bbde5c4f847dca86facba65aa4231";

const generateCuisines = () => {
  cuisinesSelect.innerHTML = `<option onclick="cuisine = ''">Cuisine</option>`;
  cuisinesSelect.innerHTML += cuisines.reduce((acc, cui) => acc += `<option onclick="cuisine = this.value">${cui}</option>`, "");
};
generateCuisines();

const generateTypes = () => {
  typesSelect.innerHTML = `<option "onclick="type = ''">Type</option>`;
  typesSelect.innerHTML += types.reduce((acc, type) => acc += `<option onclick="type = this.value">${type}</option>`, "");
};
generateTypes();

searchbox.addEventListener("keyup", (event) => recipe = event.target.value.toLowerCase());

const generateRecipes = () => {
  if (recipe.length >= 3 || cuisine || type) {
    listOfRecipes.innerHTML = "";
    recipesInformation = {};
    recipesForCarrousel = [];
    fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&diet=vegetarian&number=12&query=${recipe}&cuisine=${cuisine}&type=${type}`)
    .then(response => response.json())
    .then(data => {
      // data.results.forEach(rec => {
      //   displayRecipes(rec);        
      // })
      let recipesID = data.results.reduce((acc, rec, index) => {
        acc += rec.id;
        if (!(index === data.results.length - 1)) {
          return acc += ",";
        }
        return acc;
      }, "");
      displayRecipes(recipesID)
    })
  }
}; 

const displayRecipes = (rec) => {
  fetch(`https://api.spoonacular.com/recipes/informationBulk?apiKey=${apiKey}&ids=${rec}`)
  // fetch(`https://api.spoonacular.com/recipes/${rec.id}/information?apiKey=${apiKey}`)
  .then(response => response.json())
  .then(data => {
    data.forEach(rec => {
      console.log(rec);
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

        recipesForCarrousel.push(recipesInformation[rec.id]);

        listOfRecipes.innerHTML += `
          <div class="col-md-6 col-lg-3 mb-5">
            <div class="card">
              <div style="background-image: url(${rec.image})" class="card-img-top"></div>
              <div class="card-body">
                <h5 class="card-title">${rec.title}</h5>
                <p class="card-text">${rec.summary.split(" ").slice(0, 40).join(" ")}...</p>
              </div>
              <button id="${rec.id}" onclick="recipeModal(this)" class="btn  my-2" type="submit" data-toggle="modal" data-target="#recipeModal">Read Recipe</button>
            </div>
          </div>
        `;
      }       
    })
  })
};

const generateOptionalRecipes = (num1, num2) => {
  return recipesForCarrousel.slice(num1, num2).reduce((acc, rec) => {
    return acc += `
      <div id="${rec.id}" style="cursor: pointer" onclick="recipeModal(this)" class="col-lg-3 col-md-6 col-sm-6">
        <a href="#recipe-title-h1">
          <div class="similar-recipe">
            <div class="pic">
              <img class="img-responsive" src="${rec.image}" alt="">
            </div>
            <div class="recipe-content">
              <h3 class="title">${rec.title}</h3>
            </div>
          </div>
        </a> 
      </div>
    `;
  }, "")
}


let recipeTitle = document.querySelector("#recipe-title");
let recipeTitleH1 = document.querySelector("#recipe-title-h1");
let recipeImage = document.querySelector("#recipe-image");
let recipeSummary = document.querySelector("#recipe-summary");
let recipeCookingMinutes = document.querySelector("#recipe-cooking-minutes");
let recipeReadyInMinutes = document.querySelector("#recipe-ready-in-minutes");
let recipeServings = document.querySelector("#recipe-servings");
let recipeIngredients = document.querySelector("#recipe-ingredients");
let recipeSteps = document.querySelector("#recipe-steps");
let optionalRecipes1 = document.querySelector("#optional-recipes1");
let optionalRecipes2 = document.querySelector("#optional-recipes2");


generateRecipesButton.addEventListener("click", generateRecipes);

const recipeModal = (data) => {
  const recipeInfo = recipesInformation[data.id];
  const { title, image, summary, cookingMinutes, readyInMinutes, servings, ingredients, steps } = recipeInfo;
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
  optionalRecipes2.innerHTML = generateOptionalRecipes(4, 8);  
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
