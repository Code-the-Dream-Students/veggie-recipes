const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Pass model object to create mongoose schema
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'Please enter a user name.'],
        trim: true
    },
    email: {
        type: String,
        unique: true,   // Makes email unique, by creating index in db
        required: [true, 'Please enter an email.'],
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        trim: true,
        minlength: 7
    },
    recipes: [{
        recipe: {
            type: String
        }
    }],
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
    }, {
    timestamps: true
})

// Methods user-defined function that can be used directly on the instance to generate auth token
// We need this binding so we are using standard function
userSchema.methods.generateAuthToken = async function () {
    // Individual user that token will be generated for(Optional: So we don't have to use this.user down below)
    const user = this;
    // Create token, {_id: user._id.toString()} - payload, 'veggie-recipes' - secret
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    // Add token to user.tokens array
    user.tokens = user.tokens.concat({ token });
    // Save user
    await user.save();
    
    return token;
}

// Statics user-defined function that can be used directly on the model to find user credentials
// This binding will not play a role so can use arrow function
userSchema.statics.findByCredentials = async (email, password) => {
    // Will return one user, we provide object as search criteria
    const user = await User.findOne({ email });
    // If user is not found, throw error
    if (!user) {
        throw new Error('Unable to login');
    }
    // Compare plain-text password with user's hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    // If not a match, throw error
    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
}


// Middleware (Pre hook) function that runs before save action
// 'save' - name of event, function - function to run, 'next' - next() tells function that it's done
// function has to be standard, due to 'this' binding
// Hash password before user is saved
userSchema.pre('save', async function (next) {
    // Individual user that is about to be saved (Optional: So we don't have to use this.user down below)
    const user = this;
    // Check if password has been modified, isModified('password') is mongoose method, 'password' is the field to look for
    if (user.isModified('password')) {
        // Hash user password, user.password - thing to hash, 8 - number of rounds
        user.password = await bcrypt.hash(user.password, 8);
    }
    // Middleware is done
    next();
})

// Pass userSchema to mongoose model
const User = mongoose.model('User', userSchema);

module.exports = User;

/*
Mongoose Middleware Documentation
https://mongoosejs.com/docs/middleware.html#:~:text=Middleware%20(also%20called%20pre%20and,is%20useful%20for%20writing%20plugins.
Mongoose Models
https://mongoosejs.com/docs/models.html

*/