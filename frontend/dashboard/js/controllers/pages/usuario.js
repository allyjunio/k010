angular.module('AceApp').controller('UsuarioCtrl', function ($scope, $timeout, $compile, $uibModal, Restangular, paginasStates, $gritter) {

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

	$scope.getAllUsuarios = function(){
		var usuarios = Restangular.all('usuario');
		usuarios.getList().then(function (listUsuarios) {
			$scope.allUsuarios = listUsuarios;
		});
	};

	$scope.getAllUsuarios();

	Restangular.all('perfilAcesso').getList().then(function(listPerfisAcesso){
		$scope.allPerfilAcesso = listPerfisAcesso;
	});

	$scope.openModal = function (_id) {
		Restangular.one('usuario', _id).get().then(function (usuario) {
			for(var i = 0; i < usuario.roles[0].perfilAcesso.length; i++){
				usuario.roles[0].perfilAcesso[i] = paginasStates.getPagina(usuario.roles[0].perfilAcesso[i]).title;
			}
			$scope.usuarioModal = usuario;
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'modalContent.html',
				resolve: {
					usuarioModal: function () {
						return $scope.usuarioModal;
					}
				},
				controller: function ($scope, $uibModalInstance, usuarioModal) {
					$scope.usuarioModal = usuarioModal;
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
		$scope.cadastro.nomeLower = $scope.cadastro.nome.toLowerCase();
		$scope.cadastro.roles = [$scope.cadastro.role];

		if ($scope.cadastro._id) {
			Restangular.one('usuario', this.cadastro._id).customPOST(this.cadastro).then(function (result) {
				$scope.alertResult(result);
			});
		} else {
			Restangular.all('usuario').post($scope.cadastro).then(function (result) {
				$scope.alertResult(result);
			});
		}
	};
	
	$scope.restore = function (_id) {
		Restangular.one('usuario', _id).get().then(function (usuario) {
			$scope.cadastro = usuario;
			$scope.cadastro.role = usuario.roles[0];
			$scope.selectEdit();
		});
	};

	$scope.resetForm = function () {
		$scope.cadastro = {};
	};

	$scope.alertResult = function (result) {
		if (result) {
			$scope.gritter.show('sucesso');
			$scope.resetForm();
			$scope.selectList();
			$scope.getAllUsuarios();
		}
		else $scope.gritter.show('erro');
	};

});
