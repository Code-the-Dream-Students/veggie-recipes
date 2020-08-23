const app = require("./app");

// App Listener setup
const port = process.env.PORT;
const hostname = "localhost" || "127.0.0.1";

app.listen(port, hostname, () => {
    console.log(`Server is up on port ${port} : http://${hostname}:${port}/`);
});
