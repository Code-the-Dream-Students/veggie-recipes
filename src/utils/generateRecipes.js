const fetch = require('node-fetch');
const displayRecipes = require('../utils/displayRecipes');

const URL = 'https://api.spoonacular.com/recipes/';

const generateRecipes = async (query = '', cuisine = '', type = '', number = 8) => {
    // URL to first api call
    // const search = `${process.env.URL}/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY}&query=${query}&number=${number}`;
    const search = `${URL}/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY}&query=${query}&number=${number}&diet=vegetarian&cuisine=${cuisine}&type=${type}`;

    try {
        // Recipes after first api call
        let searchResults = await(await fetch(search)).json();
        if (searchResults.results.length !== 0) {
            // Save recipes from searchResult
            const recipeIDs = searchResults.results.map(recipe => recipe.id);

            // Return all the recipes that match the recipeID 
            const newRecipes = await displayRecipes(recipeIDs);

            return newRecipes;
        }

        return [{notFound: 'Sorry no recipes exist for your search!'}];

    } catch (e) {
        console.log(e.message)
    }

}

module.exports = generateRecipes;