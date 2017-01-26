var mongoose                = require('mongoose');
var log                     = require('./log')(module);
var crypto                  = require('crypto');
var path                    = require('path');
var config                  = require('./config').Config;
var tables                  = require('./tables').Tables;

// CRIA OS MODELS
var usuario                 = require('./model/usuario'),
    client                  = require('./model/client'),
    cliente                 = require('./model/pessoa'),
    role					= require('./model/role');

mongoose.connect(config.mongoUri, config.mongoOptions);
var db = mongoose.connection;

db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.on('open', function callback() {
	log.info("Connected to DB!");
});

db.on('reconnected', function () {
	log.info('Reconected ti DB!');
});

db.on('disconnected', function() {
	log.info('DB disconected!');
	mongoose.connect(config.mongoUri, config.mongoOptions);
});

module.exports.mongoose = mongoose;