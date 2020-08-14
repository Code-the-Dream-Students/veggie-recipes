const mongoose = require('mongoose');
let url = process.env.MONGODB_URI;

// Connects to the database
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

/*
Mongoose reference
https://www.freecodecamp.org/news/introduction-to-mongoose-for-mongodb-d2a7aa593c57/#:~:text=Mongoose%20Schema%20vs.-,Model,updating%2C%20deleting%20records%2C%20etc.
*/