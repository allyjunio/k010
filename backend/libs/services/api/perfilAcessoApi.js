var express = require('express');
var router = express.Router();
var passport = require('passport');

var log = require('../../log')(module);
var mongoose = require('../../mongoose').mongoose;
var tables = require('../../tables').Tables;

const RolesModel = mongoose.model(tables.role);

router.get('/:id', passport.authenticate('bearer', {session: true}), function (req, res) {
	RolesModel.findOne({_id: mongoose.Types.ObjectId(req.params.id)})
		.then(function (perfilAcesso) {
			res.send(perfilAcesso);
		});
});

router.post('/', passport.authenticate('bearer', {session: true}), function (req, res) {
	var role = new RolesModel({
		nome: req.body.nome
		, perfilAcesso: req.body.perfilAcesso
	});
	role.save(function (err) {
		if (err) return log.error(err);
	}).then(function (newRole) {
		res.send(newRole);
	});
});

router.post('/:id', passport.authenticate('bearer', {session: true}), function (req, res) {
	RolesModel.findOne({_id: mongoose.Types.ObjectId(req.params.id)})
		.then(function (role) {
			role.nome = req.body.nome;
			role.perfilAcesso = req.body.perfilAcesso;
			role.save().then(function(result){
				res.send(result);
			});
		});
});

router.get('/', passport.authenticate('bearer', {session: true}), function (req, res) {
	RolesModel.find().then(function (perfisAcesso) {
		res.send(perfisAcesso);
	});
});

module.exports = router;