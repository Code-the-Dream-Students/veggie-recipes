const displayRecipe = document.getElementById('displayRecipe');
const getRecipes = document.getElementById('getRecipes');
const firstDiv = document.getElementById('1');

displayRecipe.addEventListener('submit', async (e) => {
    e.preventDefault();

    let formData = new FormData(displayRecipe);

    const data = {
        'query': formData.get('query'),
        'number': formData.get('number')
    };

    try {
        const res = await fetch('/search', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        });
        let recipes = await res.json();
        firstDiv.innerHTML = Object.values(recipes[0])[0].summary;
    } catch (e) {
        console.log(e.message);
    }
})

getRecipes.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
        const res = await fetch('/getRecipes');

        let recipes = await res.json();

        console.log(recipes)
    } catch (e) {
        console.log(e.message)
    }
})