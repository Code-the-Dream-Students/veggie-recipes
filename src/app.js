const express = require('express');
const path = require('path');
const userRouter = require('../src/routers/users');

// Create express object
const app = express();
// Path to views engine
const viewsPath = path.join(__dirname, '/templates/views');
// Set view engine to handlebars
app.set('view engine', 'hbs');
// Set viewsPath to views
app.set('views', viewsPath);

// Load router module in app (Pass middleware userRouter to app)
app.use(userRouter);

module.exports = app;