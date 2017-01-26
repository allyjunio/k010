var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

var mongoose            = require('./mongoose').mongoose;
var tables              = require('./tables').Tables;

const UserModel = mongoose.model(tables.usuario);
const ClientModel = mongoose.model(tables.client);

passport.use(new BasicStrategy(
    function (username, password, done) {
        ClientModel.findOne({ clientId: username }, function (err, client) {
            if (err) {
                return done(err);
            }
            if (!client) {
                return done(null, false);
            }
            if (client.clientSecret != password) {
                return done(null, false);
            }

            return done(null, client);
        });
    }
));

passport.use(new ClientPasswordStrategy(
    function (clientId, clientSecret, done) {
        ClientModel.findOne({ clientId: clientId }, function (err, client) {
            if (err) {
                return done(err);
            }
            if (!client) {
                return done(null, false);
            }
            if (client.clientSecret != clientSecret) {
                return done(null, false);
            }

            return done(null, client);
        });
    }
));

passport.use(new BearerStrategy(
    function (accessToken, done) {
        UserModel.findOne({ accesstoken: accessToken }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false);
            }

            var info = { scope: '*' , token : accessToken};
            done(null, user, info);
        });
    }
));

passport.serializeUser(function (user, done){
	done(null, user);
});

passport.deserializeUser(function(obj, done){
	done(null, obj);
});