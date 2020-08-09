/* Use the express.Router class to create modular, mountable route handlers. 
A Router instance is a complete middleware and routing system; for this reason, 
it is often referred to as a “mini-app”. */

const express = require('express');
const fetch = require('node-fetch');
const { google } = require('googleapis');
const urlParse = require('url-parse');
const jwt = require('jsonwebtoken');
const queryParse = require('query-string');
const auth = require('../middleware/auth');
const User = require('../models/user');
const googleOAuth = require('../googleAuth/googleOAuth');
const sendWelcomeEmail = require('../emails/account');
const generateRecipes = require('../utils/generateRecipes');

const SCOPES = ["email"]
/*
const URL = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY}`;
https://api.spoonacular.com/recipes/complexSearch?apiKey=c0c4732f3def410180ec614935768041&query=cheese&number=2
const URL2 = `https://api.spoonacular.com/recipes/130320/information?apiKey=${process.env.SPOONACULAR_API_KEY}`;
*/

// Create express router module
const router = new express.Router();

// GET landing page route
router.get('/', (req, res) => {
    const url = googleOAuth.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES,
        state: JSON.stringify({
            callbackUrl: req.body.callbackUrl,
            userID: req.body.userid
        })
    })

    res.render('index', {url});
})

// GET Google oauth login
router.get('/loginGoogle', async (req, res) => {
    try {
        const queryURL = new urlParse(req.url);
        const code = queryParse.parse(queryURL.query).code;
        
        // Get tokens
        const data = await googleOAuth.getToken(code);
        // Get access_token, id_token from tokens
        const tokenData = data.res.data;
        // Get tokenInfo
        const tokenInfo = await googleOAuth.getTokenInfo(tokenData.access_token)
        // Get email from tokenInfo
        const email = tokenInfo.email;
        // Find user with email from database
        const user = await User.findOne({ email });

        // If user is not found, throw error
        if (!user) {
            throw new Error('Unable to login');
        }
        // Create jwt
        const token = jwt.sign({ _id: user._id.toString()}, process.env.JWT_SECRET);
        // const token = jwt.sign({ _id: tokenData.id_token}, process.env.JWT_SECRET);

        // Add token to user.tokens array
        user.tokens = user.tokens.concat({ token });

        // Save user
        await user.save();

        // Put JWT in cookie
        res.cookie('auth_token', token);
        // Store user firstName and lastName
        // const name = encodeURIComponent(`${user.firstName} ${user.lastName}`);

        // res.redirect(302,`home/?name=${name}`)
        res.redirect(302,'home')
    } catch (e) {
        res.status(400).send(e.message);
    }
})
// GET home page
router.get('/home', auth, (req, res) => {
    const name = `${req.user.firstName} ${req.user.lastName}`;
    res.render('home', {name});
})
// GET get recipes from db
router.get('/getRecipes', auth, async (req, res) => {
    // Grab all the recipes from the db
    const recipesData = req.user.recipes;
    // Create an array of each recipe from data
    const recipes = recipesData.map(obj => {
        // Get the recipe from each obj and parse JSON string
        obj = JSON.parse(obj.recipe);
        return obj;
    })

    res.status(200).send(recipes);
})

// GET catch all pages
router.get('*', (req, res) => {
    res.redirect(302, '/');
})

// POST search for recipe on spoonacular api
router.post('/search', auth, async (req, res) => {
    try {
        // Generate recipes from search inputs
        let recipes = await generateRecipes(req.body.query, req.body.number);
        // User info
        const user = req.user;     
        // Add searched recipe with logged in user
        recipes.forEach(recipe => {
            // Stringify searchResult
            recipe = JSON.stringify(recipe);
            // user.recipes = user.recipes.concat({ recipe });
            user.recipes = [...user.recipes, {recipe}]
        });    
        // Save user with added recipe
        await user.save();
        
        res.status(200).send(recipes)
    } catch (e) {
        res.status(500).send(e.message);
    }   
})

// POST Create users
router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        const token = await user.generateAuthToken();
        const name = `${user.firstName} ${user.lastName}`;
        await sendWelcomeEmail(user.email, name);
        await user.save();

        // Put JWT in cookie
        res.cookie('auth_token', token);
    
        res.redirect(201, 'home')
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

        res.redirect(302, 'home');
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
        res.clearCookie('auth_token');

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
        
        res.status(200).send(user.recipes[0].recipe);
    } catch (e) {
        res.status(500).send(e.message);
    }
})

// router.get('/login', async (req, res) => {
//     const oauth2Client = new google.auth.OAuth2(
//         // client id
//         "901057499143-76koqpu4rsdpvmbd5em4lqhdvrfj4j37.apps.googleusercontent.com",
//         // client secret
//         "8Orh1sSrXq_29HU_ii3Jrbjk",
//         // link to redirect
//         "http://localhost:3000/home"
//     )

//     const url = oauth2Client.generateAuthUrl({
//         access_type: "offline",
//         scope: 'email',
//         state: JSON.stringify({
//             callbackUrl: req.body.callbackUrl,
//             userID: req.body.userid
//         })
//     })

//     try {
//         await fetch(url)
//         res.redirect(url);
//     } catch (e) {
//         console.log(e.message)
//     }


// })

// router.get('/getUrl', async (req, res) => {
//     const oauth2Client = new google.auth.OAuth2(
//         // client id
//         "901057499143-76koqpu4rsdpvmbd5em4lqhdvrfj4j37.apps.googleusercontent.com",
//         // client secret
//         "8Orh1sSrXq_29HU_ii3Jrbjk",
//         // link to redirect
//         "http://localhost:3000/home"
//     )

//     const url = oauth2Client.generateAuthUrl({
//         access_type: "offline",
//         scope: 'email',
//         state: JSON.stringify({
//             callbackUrl: req.body.callbackUrl,
//             userID: req.body.userid
//         })
//     })

//     try {
//         await fetch(url)
//         res.send({url});
//     } catch (e) {
//         console.log(e.message)
//     }


// })

// GET Spoonacular data
// router.get('/search', async (req, res) => {
//     try {
//         const newUrl = `${process.env.URL}/complexSearch?apiKey=${process.env.SPOONACULAR_API_KEY}&query=${req.body.query}&number=${req.body.number}`;
//         const response = await(await fetch(newUrl)).json();

//         console.log(response);

//         res.status(200).send({response})

//         // const example = JSON.stringify(response);
//         // res.status(200).send('dummy', { example });
//     } catch (e) {
//         res.status(500).send(e.message);
//     }   
// })

module.exports = router;