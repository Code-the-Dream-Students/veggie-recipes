const mongoose = require('mongoose');

// Pass model object to create mongoose schema
const programmerSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    image: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
    },{
    timestamps: true
})

// Pass userSchema to mongoose model
const Programmer = mongoose.model('Programmer', programmerSchema);

module.exports = Programmer;

/*
Mongoose Middleware Documentation
https://mongoosejs.com/docs/middleware.html#:~:text=Middleware%20(also%20called%20pre%20and,is%20useful%20for%20writing%20plugins.
Mongoose Models
https://mongoosejs.com/docs/models.html

*/