const express = require("express");

const dotenv = require("dotenv").config()

const app = express();

const port = process.env.SERVER_PORT || 9000;

app.listen(port, () => {
    console.log(`Node server runnibgs on port: ${port}`);
})
