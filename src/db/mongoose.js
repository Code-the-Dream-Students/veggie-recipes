const mongoose = require('mongoose');
let url = process.env.MONGODB_URL;

// Connects to the database
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

/*
Mongoose reference
https://www.freecodecamp.org/news/introduction-to-mongoose-for-mongodb-d2a7aa593c57/#:~:text=Mongoose%20Schema%20vs.-,Model,updating%2C%20deleting%20records%2C%20etc.
*/