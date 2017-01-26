var express = require('express');
var router = express.Router();
var passport = require('passport');

var log = require('../../log')(module);
var mongoose = require('../../mongoose').mongoose;
var tables = require('../../tables').Tables;

const UsuarioModel = mongoose.model(tables.usuario);

router.get('/', passport.authenticate('bearer', {session: true}), function (req, res) {
	UsuarioModel.find().populate('roles').then(function (perfisAcesso) {
		res.send(perfisAcesso);
	});
});

router.get('/:id', passport.authenticate('bearer', {session: true}), function (req, res) {
	UsuarioModel.findOne({_id: mongoose.Types.ObjectId(req.params.id)}).populate('roles')
		.then(function (perfilAcesso) {
			res.send(perfilAcesso);
		});
});

router.post('/', passport.authenticate('bearer', {session: true}), function (req, res) {
	var usuario = new UsuarioModel({
		nome: req.body.nome
		, nomeLower: req.body.nomeLower
		, username: req.body.username
		, password: req.body.password
		, roles: req.body.roles
	});

	usuario.save(function (err) {
		if (err) return log.error(err);
	}).then(function (newUser) {
		res.send(newUser);
	});
});

router.post('/:id', passport.authenticate('bearer', {session: true}), function (req, res) {
	UsuarioModel.findOne({_id: mongoose.Types.ObjectId(req.params.id)})
		.then(function (usuario) {
			usuario.nome = req.body.nome;
			usuario.nomeLower = req.body.nomeLower;
			usuario.username = req.body.username;
			if(req.body.password !== undefined && req.body.password !== null) {
				usuario.password = req.body.password;
			}
			usuario.roles = req.body.roles;
			usuario.save().then(function(result){
				res.send(result);
			});
		});
});

module.exports = router;