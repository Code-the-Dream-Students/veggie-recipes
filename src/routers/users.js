/* Use the express.Router class to create modular, mountable route handlers. 
A Router instance is a complete middleware and routing system; for this reason, 
it is often referred to as a “mini-app”. */

const express = require('express');
const fetch = require('node-fetch');
const auth = require('../middleware/auth');
const User = require('../models/user');

const URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY}`;
const URL2 = 'https://api.spoonacular.com/recipes/';
/*
https://api.spoonacular.com/recipes/complexSearch?apiKey=c0c4732f3def410180ec614935768041&query=cheese&number=2
const URL2 = `https://api.spoonacular.com/recipes/130320/information?apiKey=${process.env.SPOONACULAR_API_KEY}`;
*/

// Create express router module
const router = new express.Router();

// GET Home page route
router.get('/', (req, res) => {
    res.render('index');
})

// // POST Login dummy route
// router.post('/login', (req, res) => {
//     let name = req.body.name;

//     console.log(req.body);

//     res.render('dummy', { name })
// })

// GET Spoonacular data
router.get('/search', async (req, res) => {
    try {
        const newUrl = `${URL}&query=${req.body.query}&number=${req.body.number}`;
        const response = await(await fetch(newUrl)).json();

        console.log(response);

        res.status(200).send({response})

        // const example = JSON.stringify(response);
        // res.status(200).send('dummy', { example });
    } catch (e) {
        res.status(500).send(e.message);
    }   
})

// POST Create users
router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        const token = await user.generateAuthToken();

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

// POST User login
router.post('/login', async (req, res) => {
    try {
        // Find user using email and password
        const user = await User.findByCredentials(req.body.email, req.body.password);
        // Generate auth token
        const token = await user.generateAuthToken();
        // Put JWT in cookie
        res.cookie('auth_token', token);
        // User that logged in's first name
        const firstName = user.firstName;

        res.status(200).render('dummy', {firstName});
    } catch (e) {
        res.status(400).send();
    }
})

// POST Logout user
router.post('/logout', auth, async (req, res) => {
    try {
        // Create a new array of tokens
        // Remove the token in the user array that matches with the token in the req
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        // Save user with removed token
        await req.user.save();
        // Clear token from cookie
        // res.clearCookie('auth_token');

        res.redirect('/');
    } catch (e) {
        res.status(500).send(e.message);
    }
})

// POST Save Recipe
router.post('/saveRecipe', auth, async (req, res) => {
    try {
        // const newUrl = `${URL}&query=${req.body.query}&number=${req.body.number}`;
        const newUrl = `${URL2}/${req.body.recipeID}/information?apiKey=${process.env.SPOONACULAR_API_KEY}`;
        const user = req.user;
        const response = await(await fetch(newUrl)).json();
        const recipe = JSON.stringify(response);
        // Add searched recipe with logged in user
        user.recipes = user.recipes.concat({ recipe });
        // Save user with added recipe
        await user.save();
        
        res.status(200).send({user})
    } catch (e) {
        res.status(500).send(e.message);
    }
})

module.exports = router;