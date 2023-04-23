const mongoose = require('mongoose');

async function connect() {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log('Mongo DataBase Connected!');
    } catch (error) {
        console.log('Database Error', error);
    }
}

module.exports = { connect };