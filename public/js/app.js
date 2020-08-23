let recipe = "";
let cuisine = "";
let type = "";
const searchRecipesForm = document.getElementById('searchRecipes');
let listOfRecipes = document.querySelector("#list-of-recipes");
let searchbox = document.querySelector("#searchbox");
let generateRecipesButton = document.querySelector("#generate-recipes");
let modalBody = document.querySelector(".modal-content");
let modalButton = document.querySelector("#modal-button");
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

        generateRecipes(recipes)
        
    } catch (e) {
        console.log(e.message);
    }
});

const displayRecipes = (rec) => {
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
  // optionalRecipes1.innerHTML = generateOptionalRecipes(0, 4);  
  // optionalRecipes2.innerHTML = generateOptionalRecipes(4, 8);  
};

// const generateOptionalRecipes = (num1, num2) => {
//   return recipesForCarrousel.slice(num1, num2).reduce((acc, rec) => {
//     return acc += `
//       <div id="${rec.id}" style="cursor: pointer" onclick="recipeModal(this)" class="col-lg-3 col-md-6 col-sm-6">
//         <div class="similar-recipe">
//           <div class="pic">
//             <img class="img-responsive" src="${rec.image}" alt="">
//           </div>
//           <div class="recipe-content">
//             <h3 class="title">${rec.title}</h3>
//           </div>
//         </div>
//       </div>
//     `;
//   }, "")
// }

// generateRecipesButton.addEventListener("click", generateRecipes);

// const recipeModal = (data) => {
//   const recipeInfo = recipesInformation[data.id];
//   modalTitle.textContent = recipeInfo.title;
//   modalBody.innerHTML = `

    // <div class="modal-header">
    //   <nav aria-label="breadcrumb">
    //     <ol class="breadcrumb purple lighten-4">
    //       <li class="breadcrumb-item"><a href="#">home</a><i class="fas fa-angle-right mx-2 breadcrumb-green"
    //           aria-hidden="true"></i>
    //       </li>
    //       <li class="breadcrumb-item"><a href="#">recipe</a><i class="fas fa-angle-right mx-2 breadcrumb-green"
    //           aria-hidden="true"></i></li>
    //       <li class="breadcrumb-item active">${recipeInfo.title}</li>
    //     </ol>
    //   </nav>
    //   <button type="button" class="close" data-dismiss="modal" aria-label="Close">
    //     <span aria-hidden="true">&times;</span>
    //   </button>
    // </div>
    // <div class="modal-body">
    //   <div class="row">
    //     <div class="col-sm-4 col-md-4">
    //       <img src="${recipeInfo.image}" alt="Responsive image" class="img-responsive modal-img">
    //     </div>
    //     <div class=" col-sm-8 col-md-8">
    //       <h1 class=" main-title-modal">${recipeInfo.title}</h1>
    //       <p>${recipeInfo.summary}</p>
    //     </div>
    //   </div>
    //   <section class="fieldset">
    //     <div class="specs-wrapper">
    //       <h4>Specs</h4>
    //       <div class="specs">
    //         <div class="specs-content">
    //           <h2> Total</h2>
    //           <div class="specs">
    //             <div class="wrapper-specs">
    //               <h3>${recipeInfo.readyInMinutes}</h3>
    //             </div>
    //             <div class="specs-minutes">minutes </div>
    //           </div>
    //         </div>
    //         <div class=" specs-content">
    //           <h2>Servings</h2>
    //           <div class=" specs">
    //             <div class="wrapper-specs">
    //               <h3 class="price">${recipeInfo.servings}</h3>
    //             </div>
    //             <div class="specs-minutes">people</div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   </section>
    //   <div class="row">
    //     <div class="col-sm-6 col-md-6">
    //       <h1 class="sub-title-modal">Ingredients</h1>
    //       <ul>
    //         ${recipeInfo.ingredients.reduce((acc, ingredient) => acc += `<li>${ingredient}</li>`,"")}
    //       </ul>
    //     </div>
    //     <div class="col-sm-6 col-md-6">
    //       <h1 class="sub-title-modal">Steps</h1>
    //       <ul>
    //         ${recipeInfo.steps.reduce((acc, step) => acc += `<li>${step}</li>`,"")}
    //       </ul>
    //     </div>
    //   </div>
    //   <div class="additional-recipes">
    //   <div class="modal-love">You may also love</div>
    // </div>

    // <!--carousel-->
    // <div class="container">
    //   <div class="row blog">
    //     <div class="col-md-12">
    //       <div id="blogCarousel" class="carousel slide" data-ride="carousel">
    //         <ol class="carousel-indicators">
    //           <li data-target="#blogCarousel" data-slide-to="0" class="active"></li>
    //           <li data-target="#blogCarousel" data-slide-to="1"></li>
    //         </ol>

    //         <!-- Carousel items -->
    //         <div class="carousel-inner">
    //           <div class="carousel-item active">
    //             <div class="row">
    //               ${generateOptionalRecipes(0, 4)}        
    //             </div>
    //             <!--.row-->
    //           </div>
    //           <!--.item-->

    //           <div class="carousel-item">
    //             <div class="row">
    //               ${generateOptionalRecipes(4, 8)}      
    //             </div>
    //             <!--.row-->
    //           </div>
    //           <!--.item-->

    //         </div>
    //         <!--.carousel-inner-->
    //       </div>
    //       <!--.Carousel-->

    //     </div>
    //   </div>
    // </div>
//     <!---------------------------
//     CAROUSEL
//     ----------------------------->
//     <!--/carrousel-->
//     <!--/modal body -->
//     <div class="modal-footer">
//       <button type="button" class="btn my-2" data-dismiss="modal">Close</button>
//     </div>
//   `;
//   // modalButton.click();
// };

// searchRecipesForm.addEventListener('submit', async (e) => {
//   e.preventDefault();

//   let formData = new FormData(searchRecipesForm);

//   const data = {
//       'query': formData.get('query'),
//   };

//   try {
//       const res = await fetch('/search', {
//           method: 'POST',
//           body: JSON.stringify(data),
//           headers: {'Content-Type': 'application/json'}
//       });
      
//       let recipes = await res.json();
//       console.log(recipes)
//       // firstDiv.innerHTML = Object.values(recipes[0])[0].summary;
//   } catch (e) {
//       console.log(e.message);
//   }
// })

// $("#searchRecipes").click(function (e) {
//   e.preventDefault();

//   let formData = new FormData(searchRecipesForm);

//   const data = {
//       'query': formData.get('query'),
//   };
//   $.ajax({
//       url: "/search",
//       type: "post",
//       data: data,
//       success: function (recipes) {
//           $("#search-results").html(recipes);
//       }
//   });
// })


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
