var express = require('express');
var router = express.Router();
var passport = require('passport');
var async = require('async');

var amigoSecreto = require('../../amigoSecreto');
var log = require('../../log')(module);
var mongoose = require('../../mongoose').mongoose;
var tables = require('../../tables').Tables;
var mailer = require('../../mailer');



const PessoaModel = mongoose.model(tables.pessoa);

router.get('/', passport.authenticate('bearer', {session: true}), function (req, res) {
	PessoaModel.find().populate('amigo').then(function (result) {
		res.send(result);
	});
});

router.get('/:id', passport.authenticate('bearer', {session: true}), function (req, res) {
	PessoaModel.findOne({_id: mongoose.Types.ObjectId(req.params.id)})
		.populate({
			path: 'clienteProdutos'
			, populate: {path: 'licencas', populate: {path: 'produtoVersao'}}
			, populate: {path: 'produto'}
		})
		.then(function (cliente) {
			res.send(cliente);
		});
});

router.get('/realizar/sorteio', passport.authenticate('bearer', {session: true}), function (req, res) {
    PessoaModel.find({}).select('_id').exec(function (err, someValue) {
        if (err) return next(err);

        var idPessoas = "";

        someValue.forEach(function(jedi){
            idPessoas += (idPessoas.length  > 1 ? " " + jedi._id : jedi._id);
        });

        var amigos = amigoSecreto.sorteio(idPessoas);

        if(amigos){
            async.parallel([
                function(callback) {
                    for (var sender in amigos) {
                    	PessoaModel.findByIdAndUpdate(sender, { $set: { amigo: amigos[sender] }}, { new: true }, function (err, tank) {
                        	if (err) return res.send(false);
                    	});
                    }

                    callback();
                },
                function(callback) {
                    PessoaModel.find({}).populate('amigo').exec(function (err, pessoas) {

                        pessoas.forEach(function(pessoa) {
                            mailer.sendMail(pessoa.email, pessoa.amigo.nome);
                        });

                        callback(null, pessoas);
                    });
                }
            ], function(err, pessoas) {
                if (err) {
                    //Handle the error in some way. Here we simply throw it
                    //Other options: pass it on to an outer callback, log it etc.
                    res.send(false);
                }
                console.log('Both a and b are saved now');
                res.send(pessoas[1]);
            });
		}
    });
});

router.post('/', passport.authenticate('bearer', {session: true}), function (req, res) {
	var cliente = new PessoaModel(req.body);

    cliente.save(function (err, pessoa) {
        if (err)
        	return res.send(false);

        res.send(true);
    })
});

router.post('/:id', passport.authenticate('bearer', {session: true}), function (req, res) {
	PessoaModel.findOne({_id: mongoose.Types.ObjectId(req.params.id)})
        .populate('amigo')
		.then(function (cliente) {
			cliente.nome = req.body.nome;
			cliente.telefone = req.body.telefone;
			cliente.uid = req.body.uid;
			cliente.email = req.body.email;
			cliente.detalhes = req.body.detalhes;
			cliente.coordenadas = req.body.coordenadas;
			cliente.save().then(function (result) {
				res.send(result ? true : false);
			});
		});
});

module.exports = router;