let recipe = "";
let cuisine = "";
let type = "";
const searchRecipesForm = document.getElementById("searchRecipes");
const searchResults = document.getElementById("search-results");
const listOfRecipes = document.getElementById("list-of-recipes");
const searchbox = document.getElementById("searchbox");
const generateRecipesButton = document.getElementById("generate-recipes");
const loader = document.getElementById("saladLoader");
const modalBody = document.querySelector(".modal-content");
const modalButton = document.getAnimations("#modal-button");
const modalTitle = document.querySelector(".modal-title");
const cuisines = [
    "african",
    "american",
    "british",
    "cajun",
    "caribbean",
    "chinese",
    "eastern european",
    "european",
    "french",
    "german",
    "greek",
    "indian",
    "irish",
    "italian",
    "japanese",
    "jewish",
    "korean",
    "latin american",
    "mediterranean",
    "mexican",
    "middle eastern",
    "nordic",
    "southern",
    "spanish",
    "thai",
    "vietnamese",
];
const types = [
    "main course",
    "side dish",
    "dessert",
    "appetizer",
    "salad",
    "bread",
    "breakfast",
    "soup",
    "beverage",
    "sauce",
    "marinade",
    "fingerfood",
    "snack",
    "drink",
];
const cuisinesSelect = document.getElementById("cuisines");
const typesSelect = document.getElementById("types");
const recipeNotFoundModal = document.getElementById("recipeNotFoundModal");
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
    cuisinesSelect.innerHTML += cuisines.reduce(
        (acc, cui) =>
            (acc += `<option value=${cui} onclick="cuisine = this.value">${cui}</option>`),
        ""
    );
};
generateCuisines();

const generateTypes = () => {
    typesSelect.innerHTML = `<option "onclick="type = ''">Type</option>`;
    typesSelect.innerHTML += types.reduce(
        (acc, type) =>
            (acc += `<option value=${type} onclick="type = this.value">${type}</option>`),
        ""
    );
};
generateTypes();

searchbox.addEventListener(
    "keyup",
    (event) => (recipe = event.target.value.toLowerCase())
);

generateRecipesButton.addEventListener("click", async (e) => {
    e.preventDefault();
    //show loader
    loader.classList.remove("hide");
    //hide results
    searchResults.classList.add("hide");
    //animate scroll to show loader
    $("html, body").animate(
        {
            scrollTop: $("#saladLoader").offset().top,
        },
        500 // 500ms
    );

    let formData = new FormData(searchRecipesForm);

    const data = {
        query: formData.get("query"),
        cuisine: formData.get("cuisine"),
        type: formData.get("type"),
    };

    try {
        const res = await fetch("/search", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        });
        let recipes = await res.json();
        recipes.forEach((recipe) => {
            recipesInformation[recipe.id] = recipe;
        });
        //hide loader
        loader.classList.add("hide");
        //show results
        searchResults.classList.remove("hide");

        generateRecipes(recipes);
    } catch (e) {
        console.log(e.message);
    }
});

const displayRecipes = (rec) => {
    recipesForCarrousel.push(recipesInformation[rec.id]);
    console.log(rec);

    let summary = rec.summary.split(" ").slice(0, 40).join(" ");
    summary = summary.replace(/(<\/?b>)/g, "");

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
    listOfRecipes.innerHTML = "";
    if (recipes[0].notFound) {
        // Show no recipes modal
        $("#recipeNotFoundModal").modal("show");
        return;
    }
    recipes.forEach((rec) => {
        displayRecipes(rec);
    });
};

let recipeInfo;
const recipeTitle = document.getElementById("recipe-title");
const recipeTitleH1 = document.getElementById("recipe-title-h1");
const recipeImage = document.getElementById("recipe-image");
const recipeSummary = document.getElementById("recipe-summary");
const recipeCookingMinutes = document.getElementById("recipe-cooking-minutes");
const recipeReadyInMinutes = document.getElementById("recipe-ready-in-minutes");
const recipeServings = document.getElementById("recipe-servings");
const recipeIngredients = document.getElementById("recipe-ingredients");
const recipeSteps = document.getElementById("recipe-steps");
const optionalRecipes1 = document.getElementById("optional-recipes1");
const optionalRecipes2 = document.getElementById("optional-recipes2");

// const favfav = (something) => {
//   let fav = recipesInformation[something.split("f")[1]];
//   fav.favorite = !fav.favorite;
//   recipeModal(fav);
// }

const recipeModal = (data) => {
    recipeInfo = recipesInformation[data.id];
    const {
        title,
        image,
        summary,
        cookingMinutes,
        readyInMinutes,
        servings,
        ingredients,
        steps,
        favorite,
    } = recipeInfo;

    buttonRecipeFavorite.innerHTML = `
    <img 
      class="false" 
      height="36px" 
      width="36px" 
      id="f${data.id}" 
      src="${favorite ? "./images/heart2.png" : "./images/heart1.png"}">
  `;
    recipeTitle.innerHTML = title;
    recipeTitleH1.innerHTML = title;
    recipeImage.setAttribute("src", image);
    recipeSummary.innerHTML = summary;
    recipeCookingMinutes.innerHTML = cookingMinutes
        ? cookingMinutes
        : readyInMinutes;
    recipeReadyInMinutes.innerHTML = readyInMinutes;
    recipeServings.innerHTML = servings;
    recipeIngredients.innerHTML = ingredients.reduce(
        (acc, ingredient) => (acc += `<li>${ingredient}</li>`),
        ""
    );
    recipeSteps.innerHTML = steps.reduce(
        (acc, step) => (acc += `<li>${step}</li>`),
        ""
    );
    optionalRecipes1.innerHTML = generateOptionalRecipes(0, 4);
    optionalRecipes2.innerHTML = generateOptionalRecipes(4, 8);
};

const generateOptionalRecipes = (num1, num2) => {
    return recipesForCarrousel.slice(num1, num2).reduce((acc, rec) => {
        return (acc += `
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
    `);
    }, "");
};

const fields = document.getElementById("fields");
const updateName = document.getElementById("update-name");
const updateEmail = document.getElementById("update-email");
const updateOldPassword = document.getElementById("update-old-password");
const updateNewPassword = document.getElementById("update-new-password");
const updateUserForm = document.getElementById("updateUser");
const buttonRecipeFavorite = document.getElementById("saveRecipeBtn");
const forgotPasswordForm = document.getElementById("forgotPassword");
const forgotPasswordMessage = document.getElementById("forgotPasswordMessage");
const forgotPasswordDiv = document.getElementById("forgotPasswordDiv");
const forgotPasswordModal = document.getElementById("forgotPasswordModal");
const forgotPasswordBtn = document.getElementById("forgotPasswordBtn");
const oldPasswordMessage = document.getElementById("oldPasswordMessage");
const newPasswordMessage = document.getElementById("newPasswordMessage");
const newEmailMessage = document.getElementById("newEmailMessage");
const newUserNameMessage = document.getElementById("newUserNameMessage");
const updateModal = document.getElementById("updateModal");
const updateUserSuccessMessage = document.getElementById(
    "updateUserSuccessMessage"
);
const recipeSaveModal = document.getElementById("recipeSaveModal");
const recipeSaveModalMessage = document.getElementById(
    "recipeSaveModalMessage"
);

const toggling = () => {
    let toggle = true;
    return () => {
        toggle = !toggle;
        updateName.readOnly = updateEmail.readOnly = updateOldPassword.readOnly = updateNewPassword.readOnly = toggle;

        if (toggle) {
            event.target.textContent = "Enable fields";
            event.target.classList.replace("btn-danger", "btn-primary");
        } else {
            event.target.textContent = "Disable fields";
            event.target.classList.replace("btn-primary", "btn-danger");
        }
    };
};

const enableDisable = toggling();

const buttonChange = (event) => {
    event.preventDefault();
    enableDisable();
};

fields.addEventListener("click", buttonChange);

// Save recipe modal button
buttonRecipeFavorite.addEventListener("click", async () => {
    try {
        const res = await fetch("/saveRecipe", {
            method: "POST",
            body: JSON.stringify(recipeInfo),
            headers: { "Content-Type": "application/json" },
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
          height="36px" 
          width="36px" 
          src="${data.saved ? "./images/heart2.png" : "./images/heart1.png"}"
        >`;
        recipeSaveModalMessage.innerHTML = `${data.message}`;
        $("#recipeSaveModal").modal("show");
    } catch (e) {
        console.log(e.message);
    }
});

// update user modal
updateUserForm.addEventListener("submit", async (event) => {
    try {
        event.preventDefault();

        let formData = new FormData(updateUserForm);

        const data = {
            userName: formData.get("userName"),
            email: formData.get("email"),
            oldPassword: formData.get("oldPassword"),
            password: formData.get("newPassword"),
        };

        const res = await fetch("/updateUser", {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        });

        let message = await res.json();

        if (message.type === "unsuccessfulOld") {
            oldPasswordMessage.classList.replace("hide", "unsuccessful");
            oldPasswordMessage.innerHTML = `${message.message}`;
        } else if (message.type === "unsuccessfulNew") {
            newPasswordMessage.classList.replace("hide", "unsuccessful");
            newPasswordMessage.innerHTML = `${message.message}`;
        } else if (message.type === "unsuccessfulEmail") {
            newEmailMessage.classList.replace("hide", "unsuccessful");
            newEmailMessage.innerHTML = `${message.message}`;
        } else if (message.type === "unsuccessfulUserName") {
            newUserNameMessage.classList.replace("hide", "unsuccessful");
            newUserNameMessage.innerHTML = `${message.message}`;
        } else if (message.type === "unsuccessfulDuplicateEmail") {
            updateUserForm.classList.add("hide");
            updateUserSuccessMessage.classList.replace(
                "successful",
                "unsuccessful"
            );
            updateUserSuccessMessage.classList.remove("hide");
            updateUserSuccessMessage.innerHTML = `${message.message}`;
        } else {
            updateUserForm.classList.add("hide");
            updateUserSuccessMessage.classList.remove("hide");
            updateUserSuccessMessage.innerHTML = `${message.message}`;
        }
    } catch (e) {
        console.log(e.message);
    }
});

// Reset update user label after modal closes
$(updateModal).on("hidden.bs.modal", function () {
    if (oldPasswordMessage.classList.contains("unsuccessful")) {
        oldPasswordMessage.classList.replace("unsuccessful", "hide");
    }

    if (newPasswordMessage.classList.contains("unsuccessful")) {
        newPasswordMessage.classList.replace("unsuccessful", "hide");
    }

    if (newEmailMessage.classList.contains("unsuccessful")) {
        newEmailMessage.classList.replace("unsuccessful", "hide");
    }

    if (newUserNameMessage.classList.contains("unsuccessful")) {
        newUserNameMessage.classList.replace("unsuccessful", "hide");
    }

    if (updateUserForm.classList.contains("hide")) {
        updateUserForm.classList.remove("hide");
    }

    updateUserSuccessMessage.classList.add("hide");
    updateUserSuccessMessage.classList.add("successful");
    updateUserSuccessMessage.classList.remove("unsuccessful");
});

// Save recipe modal button
forgotPasswordForm.addEventListener("submit", async (event) => {
    try {
        event.preventDefault();

        let formData = new FormData(forgotPasswordForm);

        const data = {
            email: formData.get("email"),
        };
        console.log(data);
        const res = await fetch("/forgotPassword", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
        });

        let message = await res.json();

        forgotPasswordMessage.classList.remove("hide");

        if (message.type === "success") {
            forgotPasswordMessage.classList.add("successful");
            forgotPasswordDiv.classList.add("hide");
            forgotPasswordBtn.classList.add("hide");
        } else {
            forgotPasswordMessage.classList.add("unsuccessful");
        }
        forgotPasswordMessage.innerHTML = `${message.message}`;
    } catch (e) {
        console.log(e.message);
    }
});

// Reset forgot password input after modal closes
$(forgotPasswordModal).on("hidden.bs.modal", function (e) {
    forgotPasswordDiv.classList.remove("hide");
    forgotPasswordBtn.classList.remove("hide");
    forgotPasswordMessage.classList.add("hide");

    if (forgotPasswordMessage.classList.contains("successful")) {
        forgotPasswordMessage.classList.remove("successful");
    } else {
        forgotPasswordMessage.classList.remove("unsuccessful");
    }
});

//----------------------------- CLIENT-SIDE REGISTER INPUT VALIDATION -------------- DeeTheDev
// ** Boostrap example validation
window.addEventListener(
    "load",
    function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName("needs-validation");
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener(
                "submit",
                function (event) {
                    if (form.checkValidity() === false) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    form.classList.add("was-validated");
                },
                false
            );
        });
    },
    false
);
