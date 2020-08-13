const displayRecipe = document.getElementById('displayRecipe');
const getRecipes = document.getElementById('getRecipes');
const firstDiv = document.getElementById('1');
const changePasswordForm = document.getElementById('changePassword');
const changePasswordDiv = document.getElementById('changePasswordDiv');

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
        console.log(recipes)
        // firstDiv.innerHTML = Object.values(recipes[0])[0].summary;
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

changePasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    let formData = new FormData(changePasswordForm);

    const data = {
        'password': formData.get('password'),
        'confirmPassword': formData.get('confirmPassword')
    };

    try {
        const res = await fetch('/changePassword', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        });
        
        let message = await res.json();

        changePasswordDiv.innerHTML = message.message;
    } catch (e) {
        changePasswordDiv.innerHTML = e.message;    
    }
})
