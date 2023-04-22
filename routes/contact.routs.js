const express = require('express');
const router = express.Router();

router.get("/getAllContacts", (req, res) => {
    // const post = req.body;
    // console.log('Posting Requiest', post);
    res.json({ message: "Get all contacts" });
});

module.expores = router;