// let searchboxFav = document.querySelector("#searchbox-fav");
// let currRecipe = "";
// let apiURL = './app.json';
// let listOfFavoriteRecipes = document.querySelector("#list-of-favorite-recipes");

// const card = (rec) => {
//   return `
    // <div class="col-md-6 col-lg-3 mb-5">
    //   <div class="card">
    //     <div style="background-image: url(${rec.image})" class="card-img-top"></div>
    //     <div class="card-body">
    //       <h5 class="card-title">${rec.title}</h5>
    //       <p>${rec.summary.split(" ").slice(0, 50).join(" ")}...</p>
    //     </div>
    //     <button class="btn  my-2" type="submit" data-toggle="modal" data-target="#recipeModal">Read Recipe</button>
    //   </div>
    // </div>
//   `;
// }

// const genRec = (event) => {
//   if (event) currRecipe = event.target.value.toLowerCase();
  
//   listOfFavoriteRecipes.innerHTML = "";
//   fetch(apiURL)
//   .then(response => response.json())
//   .then(data => {
//     if (!currRecipe) {
//       listOfFavoriteRecipes.innerHTML = data.reduce((acc, rec) => acc += card(rec), "");
//     } else {
//       listOfFavoriteRecipes.innerHTML = data.reduce((acc, rec) => {
//         if (rec.title.toLowerCase().includes(currRecipe) && currRecipe) {
//           return acc += card(rec);
//         }
//         return acc; 
//       }, "");
//     }
//   });
// }
// genRec();

// searchboxFav.addEventListener("keyup", (event) => genRec(event));