const express = require('express');
const path = require('path');
const hbs = require('hbs');
const cookieParser = require('cookie-parser');
// const helmet = require("helmet");
const userRouter = require('../src/routers/users');
// In order to create mongodb db and collection, this must be included
require('./db/mongoose');

// Create express object
const app = express();
// Secure the connection and data
// app.use(helmet());
// This header can be used to detect that the application is powered by Express, which lets hackers conduct a precise attack
// app.disable('x-powered-by')
// Path to views engine
const viewsPath = path.join(__dirname, '/templates/views');
// Path to public directory
const publicDirectoryPath = path.join(__dirname, '../public');
// Path to partials
const partialsPath = path.join(__dirname, '/templates/partials');
// Set view engine to handlebars
app.set('view engine', 'hbs');
// Set viewsPath to views
app.set('views', viewsPath);
// Set partials path to hbs engine
hbs.registerPartials(partialsPath);
// Hbs helper functions
hbs.registerHelper('splitString', function(url) {return url.split(" ").slice(0, 50).join(" ");})
hbs.registerHelper('renderPartial', function(id, context) {
    console.log(id)
    console.log(context)
});
hbs.registerHelper('reduceIngredients', function(ingredients) {return ingredients.reduce((acc, ingredient) => acc += `<li>${ingredient}</li>`,"")}) 
hbs.registerHelper('reduceSteps', function(steps) {return steps.reduce((acc, step) => acc += `<li>${step}</li>`,"")}) 
// Needed to serve static files from publicDirectoryPath
app.use(express.static(publicDirectoryPath));
// This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
// Needed to parse req.body with json payload (Can be used to parse formData obj)
app.use(express.json());
// Processes data sent from inbuilt form method and action
app.use(express.urlencoded({ extended: true }));
// Parse Cookie header and populate req.cookies with an object keyed by the cookie names. Optionally you may enable signed cookie support by passing a secret string, 
// which assigns req.secret so it may be used by other middleware.
app.use(cookieParser());
// Load router module in express app (Pass middleware userRouter to app)
app.use(userRouter);

module.exports = app;

/*
Express Ref
https://expressjs.com/en/api.html
Handlebars Ref
https://handlebarsjs.com/guide/partials.html#basic-partials
Stack question: Express.json and express.urlencoded
https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded/51844327
*/