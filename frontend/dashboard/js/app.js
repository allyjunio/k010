var app = angular
	.module('AceApp', [
		'ngAnimate',
		'ngResource',
		'ngSanitize',
		'ngTouch',
		//'angular-loading-bar',
		'oc.lazyLoad',
		'ui.bootstrap',
		'ui.router',
		'ace.directives',
		'ngStorage',
		'restangular',
		'paginasModule'
	])
	.config(function ($stateProvider, $urlRouterProvider, paginasStatesProvider/**, cfpLoadingBarProvider*/) {
		//cfpLoadingBarProvider.includeSpinner = true;

		$urlRouterProvider.otherwise('/pessoa');

		for(var state in paginasStatesProvider.allPaginas()){
			$stateProvider.state(state, paginasStatesProvider.getPagina(state));
		}
	})
	.provider('$gritter', function () {
		this.$get = function () {
			return {
				add: jQuery.gritter.add,
				remove: jQuery.gritter.remove,
				removeAll: jQuery.gritter.removeAll
			}
		}
	})
	.run(function ($rootScope, $window, Restangular) {
		if (Cookies.get('token') === null || Cookies.get('token') === undefined) {
			$window.open("/", "_self");
			return;
		}
		var access_token = Cookies.get('token');
		Restangular.setBaseUrl('/services/api');
		Restangular.setDefaultRequestParams({access_token: access_token});
		Restangular.one('user').get().then(function (user) {
			$rootScope.user = user;
		});

	});