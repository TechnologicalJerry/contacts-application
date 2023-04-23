const express = require('express');
const { getAllContactList } = require('../controllers/contact.controller');

const router = express.Router();

router.route("/getAllContacts").get(getAllContactList);

module.expores = router; 