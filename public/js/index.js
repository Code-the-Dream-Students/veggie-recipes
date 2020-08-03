const form = document.getElementById('dummyForm');
const firstDiv = document.getElementById('1');
const secondDiv = document.getElementById('2');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let formData = new FormData(form);

    const data = {
        'firstName': formData.get('firstName'),
        'lastName': formData.get('lastName'),
        'email': formData.get('email'),
        'password': formData.get('password'),
        'recipes': formData.get('recipes')
    };

    try {
        const res = await fetch('/search', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        });
        const json = await res.json();

        console.log(json)

        firstDiv.innerHTML = JSON.stringify(json);

    } catch (e) {
        console.log(e.message)
    }
    
})



