const fetch = require('node-fetch');
const displayRecipes = require('../utils/displayRecipes');

const URL = 'https://api.spoonacular.com/recipes/';

const generateRecipes = async (query = '', number = 1, cuisine = '', type = '') => {
    // URL to first api call
    // const search = `${process.env.URL}/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY}&query=${query}&number=${number}`;
    console.log(number)
    const search = `${URL}/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY}&query=${query}&number=8&diet=vegetarian&cuisine=${cuisine}&type=${type}`;
    
    try {
        // Recipes after first api call
        let searchResults = await(await fetch(search)).json();
        // Save recipes from searchResult
        const recipeIDs = searchResults.results.map(recipe => recipe.id);
        // Return all the recipes that match the recipeID 
        const newRecipes = await displayRecipes(recipeIDs);

        return newRecipes;
    } catch (e) {
        console.log(e.message)
    }

}

module.exports = generateRecipes;