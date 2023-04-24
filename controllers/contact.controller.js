const express = require('express');

const expressHandler = require('express-async-handler');

const Contact = require('../database/model');

const getAllContactList = expressHandler(async (req, res) => {
    try {
        console.log('Getting all contacts');
        const contacts = await Contact.find();
        res.json({
            status: 200,
            message: 'Getting all contacts',
            data: contacts
        });
    } catch {
        console.log('Something wrong!');
        res.status(500).json({
            error: "something wromg"
        });
    }
});

const getContact = expressHandler(async (req, res) => {
    try {
        console.log('Getting a contacts');
        const contacts = await Contact.find();
        res.json({
            status: 200,
            message: `Getting a contacts of ${req.params.id}`,
            data: contacts
        });
    } catch {
        console.log('Something wrong!');
        res.status(500).json({
            error: "something wromg"
        });
    }
    // return 0;
});

const addNewContact = expressHandler(async (req, res, next) => {
    try {
        console.log('Adding New Contact Done!');
        const newContact = await Contact.insertMany({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
        })
        res.json({
            status: 201,
            message: 'contacts added',
            data: newContact
        });
    } catch {
        console.log('Something wrong!');
        res.status(500).json({
            error: "something wromg"
        });
    }
});

const updateContacts = expressHandler(async (req, res) => {
    try {
        console.log('update contacts');
        const contacts = await Contact.find();
        res.json({
            status: 200,
            message: 'update contacts',
            data: contacts
        });
    } catch {
        console.log('Something wrong!');
        res.status(500).json({
            error: "something wromg"
        });
    }
    return 0;
});

const deleteContact = expressHandler(async (req, res, next) => {
    try {
        console.log('Delete contacts');
        const contacts = await Contact.find();
        res.json({
            status: 200,
            message: `Delete a contacts of id: ${req.params.id}`,
            data: contacts
        });
    } catch {
        console.log('Something wrong!');
        res.status(500).json({
            error: "something wromg"
        });
    }
    return 0;
});

module.exports = {
    getAllContactList,
    getContact,
    addNewContact,
    updateContacts,
    deleteContact
}