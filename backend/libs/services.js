var express     = require('express');
var router      = express.Router();
var async       = require('async');
var crypto      = require('crypto');

var servicesApi = require('./services/api');
var log         = require('./log')(module);
var mongoose    = require('./mongoose').mongoose;
var tables      = require('./tables').Tables;

const ClienteModel = mongoose.model(tables.pessoa);
const UserModel = mongoose.model(tables.usuario);

router.post('/registerUser', function(req, res){
	var params = req.body;
	var user = new UserModel({
		nome : params.nome
		, nomeLower : params.nomeLower
		, username : params.username
		, password : params.password
	});
	user.save(function(err, user) {
		if(err) return log.error(err);
		else log.info("New user - %s : %s",user.username,user.password);
	}).then(function(result){
		var cliente = new ClienteModel({
			nome : params.nome
			, telefone : params.telefone
			, uid : params.uid
			, email : params.email
			, usuario : result._id
		});
		cliente.save(function(err, result){
			if(err) return log.error(err);
			else log.info("New Company - %s : %s", result.nome, result.uid);
		})
	});
	
	res.send(true);
});

//ADICIONAR OS OUTROS SERVIÇOS
router.use('/api', servicesApi);

module.exports = router;