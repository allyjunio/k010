var mongoose                = require('mongoose');
var crypto                  = require('crypto');
var tables                  = require('../tables').Tables;

// Usuario
var Usuario = new mongoose.Schema({
    nome: {
        type: String
    },
    nomeLower: {
        type: String,
        lowercase: true,
        trim: true
    },
    email: {
        type: String
    },
    img: {
        type: String
    },
    username: {
        type: String
		, unique: true
    },
    hashedPassword: {
        type: String
    },
    salt: {
        type: String
    },
    accesstoken: String,
    refreshtoken: String,
    pushid: {
        type: String,
        default: ""
    },

    // CAMPOS QUE DETERMINAN O MODELO, PLATAFORMA E UUID DO DEVICE
    platform: {
        type: String,
        default: ""
    },
    model: {
        type: String,
        default: ""
    },
    uuid: {
        type: String,
        default: ""
    },
    created: {
        type: Date,
        default: Date.now
    },

	roles : [{ type: mongoose.Schema.ObjectId, ref: 'Role'}]
});

Usuario.methods.encryptPassword = function (password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    //more secure - return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
};

Usuario.virtual('userId')
    .get(function () {
        return this.id;
    });

Usuario.virtual('password')
    .set(function (password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(32).toString('base64');
        //more secure - this.salt = crypto.randomBytes(128).toString('base64');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function () {
        return this._plainPassword;
});


Usuario.methods.checkPassword = function (password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

Usuario.pre('save', function(next){
    this.nomeLower = this.nome.toLowerCase();
    next();
});

mongoose.model(tables.usuario, Usuario);