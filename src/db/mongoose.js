const mongoose = require('mongoose');
let url = process.env.MONGODB_URL;

// Connects to the database
mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});