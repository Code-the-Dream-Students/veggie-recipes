/* Use the express.Router class to create modular, mountable route handlers. 
A Router instance is a complete middleware and routing system; for this reason, 
it is often referred to as a “mini-app”. */

const express = require('express');

// Create express router module
const router = new express.Router();

// Home page route
router.get('/', (req, res) => {
    res.render('index');
})

module.exports = router;