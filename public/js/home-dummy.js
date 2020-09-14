const updateUser = document.getElementById('updateUser');
const firstDiv = document.getElementById('first');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');

updateUser.addEventListener('submit', async event => {
    event.preventDefault();

    let formData = new FormData(updateUser);

    const data = {
        'firstName': formData.get('firstName'),
        'lastName': formData.get('lastName'),
        'email': formData.get('email')
    };

    try {
        const res = await fetch('/updateUser', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        });
        let user = await res.json();
        console.log(user)

    } catch (e) {
        console.log(e.message);
    }
})