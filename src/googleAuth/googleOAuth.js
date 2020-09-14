const { google } = require('googleapis');

const LOCAL_LINK = "http://localhost:3000/loginGoogle";
const LINK = "https://vegeloper.herokuapp.com/loginGoogle";


const oauth2Client = new google.auth.OAuth2(
    // client id
    `${process.env.CLIENT_ID}`,
    // client secret
    `${process.env.CLIENT_SECRET}`,
    // link to redirect
    LINK
)

module.exports = oauth2Client;