const sgMail = require('@sendgrid/mail');

const sendgridAPIKEY = `${process.env.EMAIL_API_KEY}`;

sgMail.setApiKey(sendgridAPIKEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'jgabitto1792@gmail.com',
        subject: 'Thanks for joining Veggie Recipes!',
        text: `Welcome to Veggie Recipes ${name}! Hope you enjoy our app!`
    })
}

const sendForgotPasswordEmail = (email, name, password) => {
    sgMail.send({
        to: email,
        from: 'jgabitto1792@gmail.com',
        subject: 'Request for forgotten password',
        html: `Hello ${name}! Here is a temporary password to login. Once you're logged in, you can reset your password after you're logged in. 
                <div>
                    <strong>Password:</strong> ${password}
                </div>`
    })
}

const resetPasswordEmail = (email, name, password) => {
    sgMail.send({
        to: email,
        from: 'jgabitto1792@gmail.com',
        subject: 'Request for forgotten password',
        html: `Hello ${name}! Here is a temporary password to login. Once you're logged in, you can reset your password after you're logged in. 
                <div>
                    <strong>Password:</strong> ${password}
                </div>`
    })
}

const newPasswordEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'jgabitto1792@gmail.com',
        subject: 'Confirmation of password change',
        html: `Hello ${name}! You have succesfully changed your password.`
    })
}

module.exports = {
    sendWelcomeEmail,
    resetPasswordEmail,
    newPasswordEmail
};