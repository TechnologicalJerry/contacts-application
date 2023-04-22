const express = require("express");

const app = express();

const port = 5000;

app.listen(port, () => {
    console.log(`Node server runnibg on port: ${port}`);
})
