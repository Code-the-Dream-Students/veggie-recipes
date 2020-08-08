const displayRecipe = document.getElementById('displayRecipe');
const firstDiv = document.getElementById('1');

displayRecipe.addEventListener('submit', async (e) => {
    e.preventDefault();

    let formData = new FormData(displayRecipe);

    const data = {
        'query': formData.get('query'),
        'search': formData.get('search')
    };

    try {
        const res = await fetch('/search', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        });
        const recipe = await res.json();

        console.log(recipe)

        firstDiv.innerHTML = recipe[130320].summary;
    } catch (e) {
        console.log(e.message);
    }
})