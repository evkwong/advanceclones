var db = require ('../routes/database');
var bcrypt = require('bcryptjs');
var saltRounds = 10;

function User (username, email, password, avatar) {
	this.username = username;
	this.email = email;
	this.password = password;
	this.avatar = avatar;
}

module.exports = User;


module.exports.storeUser = function(user, callback){
	bcrypt.genSalt(saltRounds, function(err, salt) {
		bcrypt.hash(user.password, salt, function(err, hash) {
			var username = user.username;
			var email = user.email;
			var avatar = user.avatar;
			var password = hash;
			console.log('Hashed password:', password);

			db.query('INSERT INTO users(name, email, password, avatar) VALUES($1, $2, $3, $4) RETURNING name;',
				[username, email, password, avatar])
				.then(data => {
					console.log('Success!', 'User ' + username + ' registered!');
					req.flash('success', 'You have successfully registered! Please log in.');
					res.redirect('../../');
				})
				.catch(error => {
					callback();
				})
		});
	});
}

module.exports.getByUsername = function(username, callback) {
    db.oneOrNone('SELECT * FROM users WHERE name = $1;', [username])
		.then(data => {
			callback(null, data);
		})
		.catch(error => {
			callback(error, false);
		});
}

module.exports.getByID = function(id, callback) {
	db.oneOrNone('SELECT * FROM users WHERE id = $1;', [id])
	.then(data => {
			callback(null, data);
		})
		.catch(error => {
			callback(error, false);
		});
}

module.exports.checkPassword = function(user, password, callback){
	bcrypt.compare(password, user.password, function(err, success) {
		if(err) throw err;
		callback(null, success);
	})
}