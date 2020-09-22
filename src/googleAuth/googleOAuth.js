const { google } = require('googleapis');
const link = require('../constants/constants');

const oauth2Client = new google.auth.OAuth2(
    // client id
    process.env.CLIENT_ID,
    // client secret
    process.env.CLIENT_SECRET,
    // link to redirect
    process.env.LINK || link.LINK
)

module.exports = oauth2Client;