var express = require('express');
var router = express.Router();
var async = require('async');
var passport = require('passport');

var log = require('../log')(module);
var mongoose = require('../mongoose').mongoose;
var tables = require('../tables').Tables;

var clienteApi = require('./api/pessoaApi');
var perfilAcessoApi = require('./api/perfilAcessoApi');
var usuarioApi = require('./api/usuarioApi');

const UsuarioModel = mongoose.model(tables.usuario);

router.use('/pessoa', clienteApi);

router.use('/perfilAcesso', perfilAcessoApi);

router.use('/usuario', usuarioApi);

router.get('/loggedUsername/', passport.authenticate('bearer', {session: true}), function (req, res) {
	res.send(req.user.nome);
});

router.get('/user/', passport.authenticate('bearer', {session: true}), function (req, res) {
	UsuarioModel.findOne({_id: mongoose.Types.ObjectId(req.user._id)}).populate('roles').then(function(user){
		res.send(user);
	});
});

module.exports = router;