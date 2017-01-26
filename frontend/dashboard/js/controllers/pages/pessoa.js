angular.module('AceApp').controller('PessoaCtrl', function ($scope, $timeout, $compile, $uibModal, Restangular, $gritter) {

	$scope.tab = [true, false];
	$scope.mapRendered = false;
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

    $scope.sortear = function(){
        Restangular.all('pessoa/realizar/sorteio').getList().then(function (listPessoas) {
            $scope.pessoas = listPessoas;
            $scope.gritter.show('sucesso');
        });
    };

	$scope.getAll = function(){
		var pessoas = Restangular.all('pessoa');
		pessoas.getList().then(function (listPessoas) {
			$scope.pessoas = listPessoas;
		});
	};

	$scope.getAll();

	$scope.openModal = function (_id) {
		Restangular.one('pessoa', _id).get().then(function (pessoa) {
			$scope.pessoaModal = pessoa;
			var modalInstance = $uibModal.open({
				animation: true,
				templateUrl: 'modalContent.html',
				resolve: {
					pessoaModal: function () {
						return $scope.pessoaModal;
					}
				},
				controller: function ($scope, $uibModalInstance, pessoaModal) {
					$scope.pessoaModal = pessoaModal;
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

	$scope.enviarPessoa = function () {
		if($scope.cadastro._id){
			Restangular.one('pessoa', this.cadastro._id).customPOST(this.cadastro).then(function (result) {
				$scope.alertResult(result);
			});
		} else {
			Restangular.all('pessoa').post($scope.cadastro).then(function (result) {
				$scope.alertResult(result);
			});
		}
	};
	
	$scope.restorePessoas = function (_id) {
		Restangular.one('pessoa', _id).get().then(function (pessoa) {
			$scope.cadastro = pessoa;
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
			$scope.getAll();
		} else {
			$scope.gritter.show('erro');
		}
	};

});
