const express = require('express');
const { getAllContactList, addNewContact } = require('../controllers/contact.controller');

const router = express.Router();

router.route("/getAllContacts").get(getAllContactList).post(addNewContact)

module.expores = router; 