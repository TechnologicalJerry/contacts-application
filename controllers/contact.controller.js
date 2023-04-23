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
})

module.exports = {
    getAllContactList
}