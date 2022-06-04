const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/CordialCube_development');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error Connnecting to mongodb'));


db.once('open', function() {
    console.log('Connected to database :: MongoDB');
});

module.exports = db;