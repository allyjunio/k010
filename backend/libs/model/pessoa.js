var mongoose = require('mongoose');
var tables = require('../tables').Tables;

// Cliente
var Cliente = new mongoose.Schema({
	nome: {
		type: String,
		required: true
	},
	email: {type: String},
	amigo: {type: mongoose.Schema.ObjectId, ref: tables.pessoa}
});
// Cliente.index({coordenadas: '2dsphere'});

mongoose.model(tables.pessoa, Cliente);