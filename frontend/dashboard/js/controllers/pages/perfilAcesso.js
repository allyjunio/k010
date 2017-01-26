angular.module('AceApp').controller('PerfilAcessoCtrl', function ($scope, $rootScope, $timeout, $compile, $uibModal, Restangular, paginasStates, $gritter) {

	$scope.tab = [true, false];
	$scope.cadastro = {};

	$scope.gritter = {
		'count': 0,
		'light': false,
		'show': function(id) {
			var options = angular.copy($scope.gritter[id]);

			if( !('before_open' in options) ) options.before_open = function() { $scope.gritter.count = $scope.gritter.count + 1 }
			if( !('after_close' in options) ) options.after_close = function() { $scope.gritter.count = $scope.gritter.count - 1 }

			options['class_name'] = (options['class_name'] || '') + ($scope.gritter.light ? ' gritter-light' : '');

			$gritter.add(options);
		},
		'clear': function() {
			$gritter.removeAll();
			$scope.gritter.count = 0;
		},

		'sucesso': {
			title: 'Operação executada com sucesso!',
			// text: 'Just add "gritter-center"',
			class_name: 'gritter-info gritter-center'
		},
		'erro': {
			title: 'Erro ao executar operação.',
			// text: 'Vivamus eget tincidunt velit. Cum sociis natoque penatibus et',
			class_name: 'gritter-error'
		}
	};

	$scope.getAllPerfilAcesso = function(){
		var perfilAcesso = Restangular.all('perfilAcesso');
		perfilAcesso.getList().then(function (listPerfilAcesso) {
			$scope.allPerfilAcesso = listPerfilAcesso;
		});
	};

	$scope.getAllPerfilAcesso();

	$rootScope.paginas = [];
	for(var pagina in paginasStates.allPaginas()){
		$rootScope.paginas.push(paginasStates.getPagina(pagina));
	}

	$scope.openModal = function (_id) {
		Restangular.one('perfilAcesso', _id).get().then(function (perfilAcesso) {
			for(var i = 0; i < perfilAcesso.perfilAcesso.length; i++){
				perfilAcesso.perfilAcesso[i] = paginasStates.getPagina(perfilAcesso.perfilAcesso[i]).title;
			}
			$scope.perfilAcessoModal = perfilAcesso;
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'modalContent.html',
				resolve: {
					perfilAcessoModal: function () {
						return $scope.perfilAcessoModal;
					}
				},
				controller: function ($scope, $uibModalInstance, perfilAcessoModal) {
					$scope.perfilAcessoModal = perfilAcessoModal;
					$scope.ok = function () {
						$uibModalInstance.close();
					};
				}
			});
		});
	};

	$scope.selectEdit = function () {
		$scope.tab[1] = true;
		$scope.tab[0] = false;
	};

	$scope.selectList = function () {
		$scope.tab[0] = true;
		$scope.tab[1] = false;
	};

	$scope.$watch('editActive', function () {
		if ($scope.editActive) $scope.mapRendered = true;
	});

	$scope.enviar = function () {
		$scope.cadastro.perfilAcesso = [];
		for(var i = 0; i < $rootScope.paginas.length; i++){
			if($rootScope.paginas[i].selected) {
				$scope.cadastro.perfilAcesso.push($rootScope.paginas[i].name);
			}
		}
		
		if ($scope.cadastro._id) {
			Restangular.one('perfilAcesso', this.cadastro._id).customPOST(this.cadastro).then(function (result) {
				$scope.alertResult(result);
			});
		} else {
			Restangular.all('perfilAcesso').post($scope.cadastro).then(function (result) {
				$scope.alertResult(result);
			});
		}
	};

	$scope.resetForm = function () {
		$scope.cadastro = {};
	};

	$scope.restore = function (_id) {
		Restangular.one('perfilAcesso', _id).get().then(function (perfilAcesso) {
			$scope.cadastro = perfilAcesso;
			$scope.selectEdit();
			for(var i = 0; i < $rootScope.paginas.length; i++){
				if(perfilAcesso.perfilAcesso.indexOf($rootScope.paginas[i].name) !== -1){
					$rootScope.paginas[i].selected = true;
				}

			}
		});
	};

	$scope.alertResult = function (result) {
		if (result) {
			$scope.gritter.show('sucesso');
			$scope.resetForm();
			$scope.selectList();
			$scope.getAllPerfilAcesso();
		}
		else $scope.gritter.show('erro');
	};

});

//Controller for selectAll checkbox
angular.module('AceApp').controller('SelectTableCtrl', function ($scope, $rootScope, paginasStates) {


	$scope.selectAll = false;
	$scope.$watch('selectAll', function(newValue) {
		angular.forEach($rootScope.paginas, function(pagina, key) {
			pagina.selected = newValue;
		});
	});

});