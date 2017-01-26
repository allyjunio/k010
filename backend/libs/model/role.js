var mongoose                = require('mongoose');
var tables                  = require('../tables').Tables;

var Role = new mongoose.Schema({
	nome: {type: String,required: true}
	, perfilAcesso: [String]
});

mongoose.model(tables.role, Role);