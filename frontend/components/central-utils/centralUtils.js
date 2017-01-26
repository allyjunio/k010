(function(){
	var utils = angular.module('centralUtils', []);

	utils.provider('centralContants', function(){
		this.$get = function () { // for example
			return {
				listIcones: function () {
					return {
						citsmartITSM : {nome: 'CitsmartITSM', caminho : '../../assets/images/itsmLogo.png'}
						, citsmartGRP: {nome: 'CitsmartGRP', caminho: '../../assets/images/grpLogo.png'}
					};
				}
				, formatDate : function (date) {
					return new Date(date).toUTCString();
				}
			}
		}
	});

})();