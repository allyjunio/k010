var paginas = {
	usuario : 'usuario'
	, perfilAcesso : 'perfilAcesso'
	, pessoa : 'pessoa'
};

var perfilAcessoAdmin = [
	paginas.usuario
	, paginas.perfilAcesso
	, paginas.pessoa
];

var perfilAcessoConsultor = [
	paginas.pessoa
];

exports.paginas = paginas;
exports.perfilAcessoAdmin = perfilAcessoAdmin;
exports.perfilAcessoConsultor = perfilAcessoConsultor;
