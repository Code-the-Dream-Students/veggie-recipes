/* Use the express.Router class to create modular, mountable route handlers. 
A Router instance is a complete middleware and routing system; for this reason, 
it is often referred to as a “mini-app”. */

const express = require('express');
const fetch = require('node-fetch');
const User = require('../models/user');

// Create express router module
const router = new express.Router();

// GET Home page route
router.get('/', async (req, res) => {
    res.render('index');
})

// POST Create user
router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        const token = await user.generateAuthToken();
    
        console.log(req.body)

        await user.save();
    
        res.status(201).send({
            user,
            token
        })
    } catch (e) {
        res.status(400).send({
            'message': e.message
        })
    }
})

// POST User login route
router.post('/user/login', async (req, res) => {
    try {
        // Find user using email and password
        const user = await User.findByCredentials(req.body.email, req.body.password);
        // Generate auth token
        const token = await user.generateAuthToken();
        res.send({ user, token });
    } catch (e) {
        res.status(400).send();
    }
})

module.exports = router;