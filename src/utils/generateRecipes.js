const fetch = require('node-fetch');
const displayRecipes = require('../utils/displayRecipes');

const URL = 'https://api.spoonacular.com/recipes/';

const generateRecipes = async (query, number) => {
    // URL to first api call
    // const search = `${process.env.URL}/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY}&query=${query}&number=${number}`;
    const search = `${URL}/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY}&query=${query}&number=${number}`;
    
    // Result after 1st api call
    let searchResult = await(await fetch(search)).json();
    // Save recipes from searchResult
    const recipes = searchResult.results;
    // Return all the recipes that match the recipeID
    return await Promise.all(recipes.map(async recipe => {
        // Get recipe id from each recipe
        const recipeID = recipe.id;
        // Pass the recipeID to the next call to get specific recipe
        const newRecipes = await displayRecipes(recipeID);
        return newRecipes;
    }))
}

module.exports = generateRecipes;