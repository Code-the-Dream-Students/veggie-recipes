const displayRecipe = document.getElementById('displayRecipe');
const firstDiv = document.getElementById('1');

displayRecipe.addEventListener('submit', async (e) => {
    e.preventDefault();

    let formData = new FormData(displayRecipe);

    const data = {
        'recipeID': formData.get('recipeID')
    };

    try {
        const res = await fetch('/saveRecipe', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        });
        const recipe = await res.json();

        console.log(recipe)

        firstDiv.innerHTML = recipe.instructions;
    } catch (e) {
        console.log(e.message);
    }
})