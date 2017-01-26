(function () {

	var paginasModule = angular.module('paginasModule', []);

	paginasModule.constant('PAGINAS_CONST',
		{
			'pessoa': {
				url: '/pessoa',
				title: 'Pessoas',

				icon: 'fa fa-user',

				templateUrl: 'views/pages/pessoa.html',
				controller: 'PessoaCtrl',

				resolve: {
					lazyLoad: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load([
							{
								serie: true,
								name: 'dataTables',
								files: ['../../components/datatables/media/js/jquery.dataTables.js', '../components/_mod/datatables/jquery.dataTables.bootstrap.js', '../components/angular-datatables/dist/angular-datatables.js']
							},
							{
								name: 'gritter',
								files: ['../../components/jquery.gritter/js/jquery.gritter.js']
							},
							{
								name: 'AceApp',
								files: ['js/controllers/pages/pessoa.js']
							},
							{
								name: 'AceApp',
								insertBefore: '#main-ace-style',
								files: [
									'../components/jquery.gritter/css/jquery.gritter.css',
								]
							}
						]);
					}]
				}

			}
			, 'usuario': {
			url: '/usuario',
			title: 'Usuários',

			icon: 'fa fa-users',

			templateUrl: 'views/pages/usuario.html',
			controller: 'UsuarioCtrl',

			resolve: {
				lazyLoad: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							serie: true,
							name: 'dataTables',
							files: ['../components/datatables/media/js/jquery.dataTables.js', '../components/_mod/datatables/jquery.dataTables.bootstrap.js', '../components/angular-datatables/dist/angular-datatables.js']
						},
						{
							name: 'gritter',
							files: ['../components/jquery.gritter/js/jquery.gritter.js']
						},
						{
							name: 'AceApp',
							files: ['js/controllers/pages/usuario.js']
						},
						{
							name: 'AceApp',
							insertBefore: '#main-ace-style',
							files: [
								'../components/jquery.gritter/css/jquery.gritter.css',
							]
						}
					]);
				}]
			}

		}
			, 'perfilAcesso': {
			url: '/perfilAcesso',
			title: 'Perfil de Acesso',

			icon: 'fa fa-key',

			templateUrl: 'views/pages/perfilAcesso.html',
			controller: 'PerfilAcessoCtrl',

			resolve: {
				lazyLoad: ['$ocLazyLoad', function ($ocLazyLoad) {
					return $ocLazyLoad.load([
						{
							serie: true,
							name: 'dataTables',
							files: ['../components/datatables/media/js/jquery.dataTables.js', '../components/_mod/datatables/jquery.dataTables.bootstrap.js', '../components/angular-datatables/dist/angular-datatables.js']
						},
						{
							name: 'gritter',
							files: ['../components/jquery.gritter/js/jquery.gritter.js']
						},
						{
							name: 'AceApp',
							files: ['js/controllers/pages/perfilAcesso.js']
						},
						{
							name: 'AceApp',
							insertBefore: '#main-ace-style',
							files: [
								'../components/jquery.gritter/css/jquery.gritter.css',
							]
						}
					]);
				}]
			}
		}
		});

	paginasModule
		.provider('paginasStates', function (PAGINAS_CONST) {
			this.$get = function () {
				return {
					getPagina: function (paginaName) {
						return PAGINAS_CONST[paginaName];
					}
					, allPaginas: function () {
						return PAGINAS_CONST;
					}
				}
			}
		})
		.config(function (paginasStatesProvider, PAGINAS_CONST) {
			paginasStatesProvider.getPagina = function (paginaName) {
				return PAGINAS_CONST[paginaName];
			};
			paginasStatesProvider.allPaginas = function () {
				return PAGINAS_CONST;
			};
		});


})();