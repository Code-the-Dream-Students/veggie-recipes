const fetch = require('node-fetch');

const URL = 'https://api.spoonacular.com/recipes/';

const displayRecipes = async (recipeID) => {
    // Initialize empty object
    let recipesInformation = {};
    // URL to get recipe
    const getRecipe = `${URL}/${recipeID}/information?apiKey=${process.env.SPOONACULAR_API_KEY}`;
    // Recipe info
    const recipeInfo = await(await fetch(getRecipe)).json();

    if (recipeInfo.analyzedInstructions.length && recipeInfo.extendedIngredients.length) {
        recipesInformation[recipeInfo.id] = {
            title: recipeInfo.title,
            readyInMinutes: recipeInfo.readyInMinutes,
            servings: recipeInfo.servings,
            summary: recipeInfo.summary,
            steps: recipeInfo.analyzedInstructions[0].steps.map(s => s.step),
            ingredients: recipeInfo.extendedIngredients.map(i => i.original),
            id: recipeInfo.id
        }
    }
    return recipesInformation;
}

module.exports = displayRecipes;