var nodemailer = require('nodemailer');
var smtpTransporter = require('nodemailer-smtp-transport');
var log = require('./log')(module);

sendMail = function (to, nome) {
    var mailOptions = {
        from: '"Amigo Secreto" <allyjunio@gmail.com>', // sender address
        to: to, // list of receivers
        subject: 'Amigo Secreto ✔', // Subject line
        text: 'Seu amigo secreto é: ' + nome, // plaintext body
        html: '<b>Seu amigo secreto é: <i>' + nome + '</i></b>' // html body
    };

    var transport = nodemailer.createTransport(smtpTransporter({
        host: 'smtp-pulse.com',
        port: 465,
        secure: true,
        auth: {
            user: 'allyjunio@gmail.com',
            pass: '7ZfSfskHDkmXS'
        }
    }));

    transport.sendMail(mailOptions, function (err, info) {
		if (err) return log.error(err);
		// else console.info("MENSAGEM ENVIADA : $s", info);
	});
};

exports.sendMail = sendMail;