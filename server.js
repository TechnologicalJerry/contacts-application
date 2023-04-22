const express = require("express");

const dotenv = require("dotenv").config()

const routes = require('./routes/contact.routs.js');

const app = express();

app.use('/api/contacts', () => routes);

const port = process.env.SERVER_PORT || 9000;

app.listen(port, () => {
    console.log(`Node server runnibgs on port: ${port}`);
});


