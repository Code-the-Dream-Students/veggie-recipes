const app = require("./app");

// App Listener setup
const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
