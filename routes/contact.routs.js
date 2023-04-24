const express = require('express');
const contactController = require('../controllers/contact.controller');

const router = express.Router();

// router.get("/", (req, res, next) => {
//     res.status(200).json({ message: 'Welcome to contact API' });
// })

router.get("/getAll", contactController.getAllContactList);
router.get("/:id", contactController.getContact);
router.post("/addNew", contactController.addNewContact);
router.put("/:id", contactController.updateContacts);
router.delete("/:id", contactController.deleteContact);

module.exports = router; 