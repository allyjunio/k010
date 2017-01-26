var express = require('express');
var path = require('path');
var config = require('./libs/config').Config;
var passport = require('passport');
var http = require('http');
var https = require('https');
var fs = require('fs');

var log = require('./libs/log')(module);
var oauth2 = require('./libs/oauth2');
var fs = require('fs');
var async = require('async');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');
var methodOverride = require('method-override');

var app = express();

var allowCrossDomain = function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");

	next();
}

//app.use(favicon(__dirname + "/public/favicon.ico"));
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(multer());
app.use(passport.initialize());
app.use(passport.session())
app.use(methodOverride());
app.use(allowCrossDomain);
app.use(express.static(path.join(__dirname, "../frontend")));

require('./libs/auth');

app.get('/ErrorExample', function (req, res, next) {
	next(new Error('TESTE ERROR!!! '));
});

var services = require("./libs/services");

app.use('/services', services);

app.post('/oauth/token', oauth2.token);

app.use(function (req, res, next) {
	res.status(404);
	log.debug('Not found URL: %s', req.url);
	res.send({error: 'Not found'});
	return;
});


app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	log.error('Internal error(%d): %s', res.statusCode, err.message);
	res.send({error: err.message});
	return;
});

// var httpsOptions = {
// 	key : fs.readFileSync('./cert/centralcitsmart.key')
// 	, cert : fs.readFileSync('./cert/centralcitsmart.crt')
// };

// https.createServer(httpsOptions, app).listen(config.port || 5000, function () {
// 	log.info('Express server listening on port ' + config.port);
// });
//
app.listen(config.port, function () {
	log.info('Express server listening on port ' + config.port);
});