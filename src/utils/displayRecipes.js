const fetch = require('node-fetch');

const URL = 'https://api.spoonacular.com/recipes/';

const displayRecipes = async (ids) => {
    // Initialize empty object
    let recipesInformation = {};
    
    const recipeIDs = ids.reduce((url, id, index) => {
        if (ids.length - 1 === index) {
            return url += `${id}`;
        }

        return url += `${id},`;
    }, '')
    
    // URL to get recipe
    const recipeURL = `${URL}/informationBulk?ids=${recipeIDs}&apiKey=${process.env.SPOONACULAR_API_KEY}`;
    try {
        // Recipe info
        const recipeInfo = await(await fetch(recipeURL)).json();

        const recipes = recipeInfo.reduce((recipes2, recipe) => {
            if (recipe.analyzedInstructions.length && recipe.extendedIngredients.length) {
                recipes2.push(recipesInformation[recipe.id] = {
                    id: recipe.id,
                    title: recipe.title,
                    readyInMinutes: recipe.readyInMinutes,
                    servings: recipe.servings,
                    summary: recipe.summary,
                    steps: recipe.analyzedInstructions[0].steps.map(s => s.step),
                    ingredients: recipe.extendedIngredients.map(i => i.original),
                    image: recipe.image
                })
            }
            return recipes2;
        }, [])
        
        return recipes;

    } catch (e) {
        console.log(e.message)
    }
   
}

module.exports = displayRecipes;