const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userName: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
});

module.exports = mongoose.model('Contact', schema);