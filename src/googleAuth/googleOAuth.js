const { google } = require('googleapis');

const oauth2Client = new google.auth.OAuth2(
    // client id
    `${process.env.CLIENT_ID}`,
    // client secret
    `${process.env.CLIENT_SECRET}`,
    // link to redirect
    "http://localhost:3000/loginGoogle"
)

module.exports = oauth2Client;