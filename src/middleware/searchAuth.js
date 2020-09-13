const jwt = require('jsonwebtoken');
const User = require('../models/user');

const secret = process.env.JWT_SECRET;

const searchAuth = async (req, res, next) => {
    try {
        // Get token stored in cookie
        const token = req.cookies['auth_token'];

        if (token) {
        // Ensure the token is actually valid, created by our server, and 
        // not expired by creating a decoded payload     
        const decoded = jwt.verify(token, secret);
        // Find user by looking for _id in the decoded payload decoded._id
        // and the token in the tokens array
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        // if not user
        if (!user) {
            throw new Error();
        }

        // Store the found user in the user value of req.
        // This is done so the route handler doesn't have to 
        // find the user again and can access it in its req parameter.
        req.user = user;
        // Store token in token value of req. This is so we can 
        // have access to token value in route handler.
        req.token = token;
        }

        next();

    } catch (e) {
        // res.status(401).send({ error: 'Please authenticate.' });
        // res.status(401).send(e.message);
        res.redirect(302, '/')
    }
}

module.exports = searchAuth;