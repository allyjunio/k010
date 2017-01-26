
exibeErroTela = function(erro){
	$('#fieldError').html(erro);
	$('#fieldError').show();
};

$('.login-input').keypress(function(e){
	if(e.which === 13){
		logar();
		return false;
	}
});

logar = function(){
	$('#erro-login').hide();
	var username = $('#username').val()
		, password = $('#password').val();
	var params = {grant_type: "password", client_id: "mobileV1", client_secret: "abc123456", username: username, password: password};
	$.post("/oauth/token", params).done(function(data){
		Cookies.set('token', data.access_token);
		window.location = '/dashboard';
	}).fail(function(){
		$('#erro-login').show();
	});

};

$(document).ready(function () {
	Cookies.remove('token');
	$('#erro-login').hide();
});

// this.login = function(user) {
// 	return this.restangular.all(this.route + '/oauth/token')
// 		.post({grant_type: "password", client_id: "mobileV1", client_secret: "abc123456", username: user.username, password: user.password});
// };