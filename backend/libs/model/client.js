var mongoose                = require('mongoose');
var tables                  = require('../tables').Tables;

// Client
var ClientSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    clientId: {
        type: String,
        unique: true,
        required: true
    },
    clientSecret: {
        type: String,
        required: true
    }
});

mongoose.model(tables.client, ClientSchema);