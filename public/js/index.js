const forgotPasswordForm = document.getElementById('forgotPassword')


// forgotPasswordForm.onsubmit = forgotPassword;

forgotPasswordForm.addEventListener('submit', async (e) => {
    try {
        e.preventDefault();

        let formData = new FormData(forgotPasswordForm);

        const data = {
            'email': formData.get('email'),
        };

        const res = await fetch('/forgotPassword', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        });
        let recipes = await res.json();
        console.log(recipes)

    } catch (e) {
        console.log(e.message);
    }

})