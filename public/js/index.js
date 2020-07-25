const form = document.getElementById('dummyForm');
const firstDiv = document.getElementById('1');
const secondDiv = document.getElementById('2');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let formData = new FormData(form);

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
        const json = await res.json();

        console.log(JSON.stringify(json))

        firstDiv.innerHTML = JSON.stringify(json);


        // if (json.status === 'Success') {
        //     window.location.href = '/home';

        // } else {
        //     errorMessage.innerHTML = json.message;
        // }

    } catch (e) {
        console.log(e.message)
    }
    
})

