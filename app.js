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

let cont = document.querySelector("#cont");
let searchbox = document.querySelector("#searchbox");
let genRec = document.querySelector("#gen-rec");
let cuisines = ["african", "american", "british", "cajun", "caribbean", "chinese", "eastern european", "european", "french", "german", "greek", "endian", "irish", "italian", "japanese", "jewish", "korean", "latin american", "mediterranean", "mexican", "middle eastern", "nordic", "southern", "spanish", "thai", "vietnamese"];
let types = ["main course", "side dish", "dessert", "appetizer", "salad", "bread", "breakfast", "soup", "beverage", "sauce", "marinade", "fingerfood", "snack", "drink"];
let cuisinesSelect = document.querySelector("#cuisines");
let typesSelect = document.querySelector("#types");
let apiKey = "c0c4732f3def410180ec614935768041";


const generateCuisines = () => {
  cuisinesSelect.innerHTML = `<option>Choose...</option>`;
  cuisinesSelect.innerHTML += cuisines.reduce((acc, cui) => acc += `<option>${cui}</option>`, "");
}
generateCuisines();

const generateTypes = () => {
  typesSelect.innerHTML = `<option>Choose...</option>`;
  typesSelect.innerHTML += types.reduce((acc, type) => acc += `<option>${type}</option>`, "");
}
generateTypes();

searchbox.addEventListener("keyup", (event) => {
  recipe = event.target.value.toLowerCase();
  cont.innerHTML = "";
  cuisinesSelect.innerHTML = `<option>Choose...</option>`;
  typesSelect.innerHTML = `<option>Choose...</option>`;
  
  fetch(test1)
  .then(response => response.json())
  .then(data => {
    data.forEach(rec => {
      if (rec.title.toLowerCase().includes(recipe) && recipe) {
        cont.innerHTML += `
          <div class="box">
            <img src="${rec.image}" alt="${rec.image}">
            <h4>${rec.title}</h4>
            <p>${rec.summary.split(" ").slice(0, 50).join(" ")}...</p>
            <button>Read more</button>
          </div>
        `;
        
        rec.cuisines.forEach(cui => {
          if (cuisines.includes(cui.toLowerCase())) {
            cuisinesSelect.innerHTML += `<option>${cui}</option>`;
          }  
        })

        rec.dishTypes.forEach(type => {
          if (types.includes(type.toLowerCase())) {
            typesSelect.innerHTML += `<option>${type}</option>`;
          }  
        })

      } else if (!recipe) {
        generateCuisines();
        generateTypes();
      }
    });
  });
});


genRec.addEventListener("click", () => {
  fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=${recipe}&diet=vegetarian`)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      // data.results.forEach(rec => {
      //   fetch(`https://api.spoonacular.com/recipes/${rec.id}/information`)
      //     .then(res => res.json())
      //     .then(d => {
      //       console.log(d);
      //     })
      // })  
    })
})