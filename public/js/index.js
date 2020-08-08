// const form = document.getElementById('registerForm');
// const firstDiv = document.getElementById('1');
// const secondDiv = document.getElementById('2');

// form.addEventListener('submit', async (e) => {
//     e.preventDefault();

//     let formData = new FormData(form);

//     const data = {
//         'firstName': formData.get('firstName'),
//         'lastName': formData.get('lastName'),
//         'email': formData.get('email'),
//         'password': formData.get('password')
//     };

//     try {
//         const res = await fetch('/register', {
//             method: 'POST',
//             body: JSON.stringify(data),
//             headers: {'Content-Type': 'application/json'}
//         });
//         const json = await res.json();

//         console.log(json)

//         firstDiv.innerHTML = JSON.stringify(json);

//     } catch (e) {
//         console.log(e.message)
//     }
    
// })



