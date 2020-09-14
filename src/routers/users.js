/* Use the express.Router class to create modular, mountable route handlers. 
A Router instance is a complete middleware and routing system; for this reason, 
it is often referred to as a “mini-app”. */

const express = require('express');
const urlParse = require('url-parse');
const jwt = require('jsonwebtoken');
const queryParse = require('query-string');
const bcrypt = require('bcryptjs');
const searchAuth = require('../middleware/searchAuth');
const auth = require('../middleware/auth');
const User = require('../models/user');
const googleOAuth = require('../googleAuth/googleOAuth');
const { sendWelcomeEmail, resetPasswordEmail, newPasswordEmail, recipeEmail, updateUserEmail } = require('../emails/account');
const generateRecipes = require('../utils/generateRecipes');
const developers = require('../utils/saveProgrammers');

// Create express router module
const router = new express.Router();

// GET landing page route
router.get('/', searchAuth, (req, res) => {
    let loggedIn;
    let userName;
    let email;
    if (req.token) {
        loggedIn = true
    }
    // Create google OAuth url
    const url = googleOAuth.generateAuthUrl({
        access_type: "offline",
        scope: "email",
        state: JSON.stringify({
            callbackUrl: req.body.callbackUrl,
            userID: req.body.userid
        })
    })

    if (req.user) {
        userName = req.user.userName;
        email = req.user.email;
    }

    res.render('index', {url, loggedIn, userName, email});
})
// GET favorite recipes
router.get('/home', auth, (req, res) => {
    // Grab all the recipes from the db
    const recipesData = req.user.recipes;
    // Create an array of each recipe from data
    const recipes = recipesData.map(obj => {
        // Get the recipe from each obj and parse JSON string
        obj = JSON.parse(obj.recipe);
        return obj;
    })
    
    res.render('home', {recipes, loggedIn: true, email: req.user.email, userName: req.user.userName});
})
// GET contact
router.get('/contact', searchAuth, async (req, res) => {
    let loggedIn;

    if (req.token) {
        loggedIn = true
    }

    // Create google OAuth url
    const url = googleOAuth.generateAuthUrl({
        access_type: "offline",
        scope: "email",
        state: JSON.stringify({
            callbackUrl: req.body.callbackUrl,
            userID: req.body.userid
        })
    })

    if (req.user) {
        const userName = req.user.userName;
        const email = req.user.email;
        return res.render('contact', {developers, url, loggedIn, email: email, userName: userName});
    }
    
    res.render('contact', {developers, url, loggedIn});
})
// GET about
router.get('/about', searchAuth, (req, res) => {
    let loggedIn;
    let userName;
    let email;
    if (req.token) {
        loggedIn = true
    }

    // Create google OAuth url
    const url = googleOAuth.generateAuthUrl({
        access_type: "offline",
        scope: "email",
        state: JSON.stringify({
            callbackUrl: req.body.callbackUrl,
            userID: req.body.userid
        })
    })

    if (req.user) {
        userName = req.user.userName;
        email = req.user.email;

        return res.render('about', {url, loggedIn, email: req.user.email, userName: req.user.userName});
    }
    
     return res.render('about', {url, loggedIn});
})

// GET favorite recipes
router.get('/getFavoriteRecipes', auth, (req, res) => {
    // Grab all the recipes from the db
    const recipesData = req.user.recipes;
    // Create an array of each recipe from data
    const recipes = recipesData.map(obj => {
        // Get the recipe from each obj and parse JSON string
        obj = JSON.parse(obj.recipe);
        return obj;
    })
    
    res.send(recipes)
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
        // user.tokens = user.tokens.concat({ token });
        user.tokens = [...user.tokens, {token}];

        // Save user
        await user.save();

        // Put JWT in cookie
        res.cookie('auth_token', token);

        res.redirect(302,'home')
    } catch (e) {
        res.status(400).send(e.message);
    }
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

// POST forgot password
router.post('/forgotPassword', async (req, res) => {
    try {
        // Find user based on email provided
        const user = await User.findOne({ email: req.body.email });
        // If can't find user
        if (!user) {
            return res.send({message: 'User does not exist with the email provided.', type: 'failure'})
        }

        // Create new password
        const newPassword = require('crypto').randomBytes(32).toString('hex');
        // Assign new password to user's password
        user.password = newPassword;
        // Save user with new password
        await user.save();
        // Send user new password
        await resetPasswordEmail(user.email, user.userName, newPassword);

        res.send({message: 'Password reset was successful.', type: 'success'})
    } catch (e) {
        res.status(500).send(e.message)
    }
})
// POST change password
router.post('/changePassword', auth, async (req, res) => {
    try {
        // Get user from auth middleware
        const user = req.user;
        // Password submitted by user
        const newPassword = req.body.password;
        // Confirmed password
        const confirmedPassword = req.body.confirmPassword;
        // User's old password
        const oldPassword = user.password;
        // Compare old password to new password
        const isMatch = await bcrypt.compare(newPassword, oldPassword);
        // Throw error if old password is the same as the new password
        if (!isMatch) {
            throw new Error('Please use a new password.');
        }
        // Save new password
        if (newPassword === confirmedPassword) {
            // Save new password for the user's account
            user.password = newPassword;
            // Save user with new password
            await user.save();
            // Send user new password
            await newPasswordEmail(user.email, user.userName);

            res.status(200).send({message: 'You have successfully changed your password!'})
        } else {
            throw new Error('Passwords don\'t match');
        }
    } catch (e) {
        res.status(500).send({message: e.message})
    }
})

// POST search for recipe on spoonacular api
router.post('/search', searchAuth, async (req, res) => {
    try {
        // Generate recipes from search inputs
        let newRecipes = await generateRecipes(req.body.query, req.body.cuisine, req.body.type);  
        let savedRecipes;

        if (req.user) {
            savedRecipes = req.user.recipes;
            
            let mySet = new Set();

            for (let i = 0; i < savedRecipes.length; i++) {
                const savedParsedRecipes = JSON.parse(savedRecipes[i].recipe);
                mySet.add(savedParsedRecipes.id);     
            }
            
            for (let i = 0; i < newRecipes.length; i++) {
                if (mySet.has(newRecipes[i].id)) {
                    newRecipes[i] = {...newRecipes[i], favorite: true};
                }
            }
        }

        res.status(200).send(newRecipes)

    } catch (e) {
        res.status(500).send(e.message);
    }   
})

// POST Save recipe
router.post('/saveRecipe', searchAuth, async (req, res) => {
    try {
        // Saved or not saved message
        let message;

        // User info
        const user = req.user;

        if (user) {
            // Recipe to save
            let newRecipe = req.body;
            // Saved recipes from db
            const savedRecipes = req.user.recipes;

            if (newRecipe.favorite) {
                user.recipes = savedRecipes.reduce((acc, recipe) => {
                const parsedRecipe = JSON.parse(recipe.recipe);

                if (parsedRecipe.id === newRecipe.id) {
                    // delete parsedRecipe.favorite;

                    return [...acc];
                }

                return [...acc, {recipe: recipe.recipe}];

                }, [])

                message = 'Recipe deleted!';
    
                await user.save();
                return res.status(200).send({ recipes: user.recipes, message, saved: false });
            }

            // Add new recipe to user
            user.recipes = [...user.recipes, { recipe: JSON.stringify(newRecipe) }]
            // Save user
            await user.save();
            // Saved recipe message
            message = 'Recipe saved!';

            return res.status(200).send({recipes: user.recipes, message, saved: true});
        }

        // Saved recipe message
        message = 'Log in to save recipe!';

        return res.status(200).send({message, saved: false});
    } catch (e) {
        res.status(500).send(e.message);
    }
})

// POST email recipe
router.post('/emailRecipe', auth, async (req, res) => {
    try {
        // Get user info
        const user = req.user;
        // Set user email
        const email = req.user.email;
        // Get recipe that we want to send
        const recipe = req.body;
        // Completion message
        const message = 'Email sent!';
        // Send email with user info, recipe
        await recipeEmail(email, user.userName, recipe);

        res.status(200).send({message});
    } catch (e) {
        res.status(500).send(e.message)
    }
})

// POST Create users
router.post('/register', async (req, res) => {
    try {
        const user = new User(req.body);
        const token = await user.generateAuthToken();
        await sendWelcomeEmail(user.email, user.userName);
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
        res.status(400).send('Error logging in');
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
// PATCH Update a user by id
router.patch('/updateUser', auth, async (req, res) => {
    const user = req.user;
    // Get updates from form
    const updates = Object.keys(req.body);
    const updatesMade = [];
    let isMatchOld;
    let isMatchNew;

    try {
        if (req.body['oldPassword'] && req.body['oldPassword'] !== '') {
            isMatchOld = await bcrypt.compare(req.body['oldPassword'], user.password);
            isMatchNew = await bcrypt.compare(req.body['password'], user.password);

            if (!isMatchOld) {
                return res.status(400).send({ message: 'Password is incorrect', type: 'unsuccessfulOld'});
            }
    
            if (isMatchNew) {
                return res.status(400).send({ message: 'Please enter a new password', type: 'unsuccessfulNew'});
            }
        }


        // Update each property of user that needs to be updated
        updates.forEach(update => {
            // Check if user property is not the same as the submitted update and non empty
            if (user[update] !== req.body[update] && req.body[update] !== '' && update !== 'oldPassword') {
                user[update] = req.body[update]
                updatesMade.push(update)
            }
        })
        
        if (user.isModified('password') || user.isModified('userName') || user.isModified('email')) {
            await user.save();
            await updateUserEmail(user.email, user.userName);
            return res.status(200).send({ updates: user[updatesMade], message: 'User was updated successfully!', type: 'successful' });
        }

        if (req.body['email'] !== '') return res.status(400).send({ message: 'Please enter a new email or delete email.', type: 'unsuccessfulEmail'});

        if (req.body['userName'] !== '') return res.status(400).send({ message: 'Please enter a new username or delete username.', type: 'unsuccessfulUserName'});

        
    } catch (e) {
        if (e.code === 11000) {
            return res.status(400).send({message: 'Email is already used by another user!', type: 'unsuccessfulDuplicateEmail'});
        }
        return res.status(400).send({message: e.message});
    }

})


module.exports = router;