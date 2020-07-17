const express = require('express');
const path = require('path');
const userRouter = require('../src/routers/users');
// In order to create mongodb db and collection, this must be included
require('./db/mongoose');

// Create express object
const app = express();
// Path to views engine
const viewsPath = path.join(__dirname, '/templates/views');
// Set view engine to handlebars
app.set('view engine', 'hbs');
// Set viewsPath to views
app.set('views', viewsPath);
// This is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
// Needed to parse req.body with json payload
app.use(express.json());
// Load router module in express app (Pass middleware userRouter to app)
app.use(userRouter);

module.exports = app;

/*
https://expressjs.com/en/api.html
*/