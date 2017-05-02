var db = require (../routes/database);
var bcrypt = require('bcrypt');
var saltRounds = 10;

var User = function (id, username, email, avatar) {
	this.id = id;
	this.username = username;
	this.email = email;
	this.avatar = avatar;
}

module.exports.createUser = function(user, callback){
	bcrypt.genSalt(saltRounds, function(err, salt) {
		bcrypt.hash(user.password, salt, function(err, hash) {
			var username = user.username;
			var email = user.email;
			var password = user.password;
			var avatar = user.avatar;
			console.log('Original password:', user.password);
			var password = hash;
			console.log('New password:', password);

			db.query('INSERT INTO users(name, email, password, avatar) VALUES($1, $2, $3, $4) RETURNING name;',
				[username, email, password, avatar]);
		});
	});
}