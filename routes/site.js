module.exports.notLoggedIn = function(res){
	var error = {msg: 'You are not logged in!'};
	var errors = [error];
	res.render('index', {errors: errors});
};