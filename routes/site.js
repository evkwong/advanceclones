module.exports.notLoggedIn = function(res) {
	var error = {msg: 'You are not logged in!'};
	var errors = [error];
	res.render('index', {errors: errors});
};

module.exports.loggedOut = function(res) {
	var message = {msg: 'You have succesfully logged out.'}
	var messages = [message];
	res.render('index', {messages: messages});
}

module.exports.gameFull = function(res) {
	var error = {msg: 'That game is currently full.'};
	var errors = [error];
	res.render('lobby', {errors: errors});
}