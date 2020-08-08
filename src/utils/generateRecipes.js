const fetch = require('node-fetch');
const displayRecipes = require('../utils/displayRecipes');

const URL2 = 'https://api.spoonacular.com/recipes/';

const generateRecipes = async (query, number) => {
    // URL to first api call
    // const search = `${process.env.URL}/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY}&query=${query}&number=${number}`;
    const search = `${URL2}/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY}&query=${query}&number=1`;

    // Result after 1st api call
    let searchResult = await(await fetch(search)).json();
    const recipe = searchResult.results[0].id;

    return displayRecipes(recipe);
}

module.exports = generateRecipes;