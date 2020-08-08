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

module.exports = sendWelcomeEmail;