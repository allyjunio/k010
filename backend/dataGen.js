var log                 = require('./libs/log')(module);
var mongoose            = require('./libs/mongoose').mongoose;
var tables              = require('./libs/tables').Tables;
var perfilAcesso		= require('./libs/perfilAcesso');
var async				= require('async');

const UserModel = mongoose.model(tables.usuario);
const ClientModel = mongoose.model(tables.client);
const RoleModel = mongoose.model(tables.role);

var roleAdminStored, roleConsultorStored;
async.series([
	function (callback){
		ClientModel.remove({}, function(err) {
			var client = new ClientModel({ name: "OurService iOS client v1", clientId: "mobileV1", clientSecret:"abc123456" });
			client.save(function(err, client) {
				if(err) return log.error(err);
				else log.info("New client - %s:%s",client.clientId,client.clientSecret);
				callback();
			});
		});

	}
	, function (callback) {
		var roleAdmin = new RoleModel({
			nome : 'admin'
			, perfilAcesso : perfilAcesso.perfilAcessoAdmin
		});
		roleAdmin.save(function (err, newRole){
			if(err) return log.error(err);
			else log.info('Admin role created');
			roleAdminStored = newRole;
			callback();
		});

	}
	, function (callback) {
		var roleConsultor = new RoleModel({
			nome : 'consultor'
			, perfilAcesso : perfilAcesso.perfilAcessoConsultor
		});
		roleConsultor.save(function (err, newRole){
			if(err) return log.error(err);
			else log.info('Consultor role created');
			roleConsultorStored = newRole;
			callback();
		});
	}
	, function (callback) {
		UserModel.remove({}, function(err) {
			var user = new UserModel({ username: "admin", password: "admin", nome: 'Administrador', nomeLower: 'administrador', img: 'img/noimage.jpg' , roles : [roleAdminStored._id]});
			user.save(function(err, user) {
				if(err) return log.error(err);
				else log.info("New user - %s:%s",user.username,user.password);
			});

			var consultor = new UserModel({ username: "consultor", password: "consultor", nome: 'Consultor', nomeLower: 'consultor', img: 'img/noimage.jpg' , roles : [roleConsultorStored._id]});
			consultor.save(function(err, user) {
				if(err) return log.error(err);
				else log.info("New user - %s:%s",user.username,user.password);
			});
		});
		setTimeout(function() {
			mongoose.disconnect();
		}, 3000);
	}
]);

