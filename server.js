const express = require("express");

const dotenv = require("dotenv").config()

const routes = require('./routes/contact.routs.js');

const { connect } = require('./database/dbConfig.js');
const errorHandler = require("./middleware/contact.middleware.js");

const app = express();

connect();

app.use(express.json());

app.use(errorHandler);

app.use('/api/contacts', routes);

const port = process.env.SERVER_PORT || 9000;

app.listen(port, () => {
    console.log(`Node server runnibgs on port: ${port}`);
});


