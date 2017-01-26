var dev = {
	port        : 3001,
	tokenLife   : 3600,
	// mongoUri    : "mongodb://127.0.0.1:27017/central_citsmart",
    mongoUri    : "mongodb://ds059804.mlab.com:59804/heroku_w6kg1d6r",
	mongoOptions: {
		user : 'teste',
		pass : 'teste',
		server: {
			poolSize: 10,
			reconnectTries:	60,
			reconnectInterval: 1000,
			socketOptions: {
				keepAlive: 300000,
				connectTimeoutMS: 30000
			}
		}
	},
	env         : global.process.env.NODE_ENV || 'dev'
};

var prod = {
	port        : process.env.PORT || 443,
	tokenLife   : 3600,
	mongoUri    : "mongodb://ds059804.mlab.com:59804/heroku_w6kg1d6r",
	mongoOptions: {
		user: 'teste',
		pass: 'teste',
		server: {
				poolSize: 10,
				reconnectTries:	60,
				reconnectInterval: 1000,
				socketOptions: {
							keepAlive: 300000,
							connectTimeoutMS: 30000
				}
		}
	},
	env         : global.process.env.NODE_ENV || 'prod'
};

exports.Config = global.process.env.NODE_ENV === 'prod' ? prod : dev;
