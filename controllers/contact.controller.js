const express = require('express');

const expressHandler = require('express-async-handler');

const Contact = require('../database/model');

const getAllContactList = expressHandler(async (req, res, next) => {
    const contacts = await Contact.find();
    if (contacts) {
        console.log('Getting all contacts');
    } else {
        console.log('Something wrong!');
    }
});

const addNewContact = expressHandler(async (req, res, next) => {
    const newContact = await Contact.insertMany({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
    })
    if (newContact) {
        console.log('newContact added done!');
    } else {
        console.log('Something wrong!');
    }
});

module.exports = {
    getAllContactList, addNewContact
}