var bcrypt = require('bcryptjs');
var express = require('express');
var db = require('./database');
var User = require('../models/user');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//User registration.
router.post('/register', function(req, res){
	req.checkBody('username', 'Name is required.').notEmpty();
	req.checkBody('email', 'Email is required.').notEmpty();
	req.checkBody('email', 'That is not a valid email.').isEmail();
	req.checkBody('password', 'Password is required.').notEmpty();
	req.checkBody('password2', 'Passwords do not match.').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors) {
		res.render('registration', {
			errors:errors
		});
	}
	else {
		console.log('No errors. Creating new user.');
		var username = req.body.username;
		var email = req.body.email;
		var password = req.body.password;
		var avatar = req.body.avatar;

		//Hash password and store user in database function.
		storeUser = function(username, email, password, avatar){
			bcrypt.genSalt(10, function(err, salt) {
				bcrypt.hash(password, salt, function(err, hash) {
					console.log('Original password:', password);
					password = hash;
					console.log('New password:', password);

					db.one('INSERT INTO users(name, email, password, avatar) VALUES($1, $2, $3, $4) RETURNING name;',
						[username, email, password, avatar])
						.then(data => {
							console.log('Success!', 'User ' + username + ' registered!');
							req.flash('success', 'You have successfully registered!');
							res.redirect('../../');
						})
						.catch(error => {
							console.log('Error:', error);
						})

				});
			});
		}

		storeUser(username, email, password, avatar);
	}
});

//User login.
router.post('/login', function(req, res){
	console.log('Post request to /users/login');
	const name = username;


		

	db.one('SELECT * FROM users WHERE name = $1;', [name])
		.then(data => {
			if (name = data.name){ //Change to password
				console.log('Logged in!');
				req.app.set('user', name);
				console.log('User:', req.app.get('user'));

				var user = new User(username, email, avatar);
			}
		})
		.catch(error => {
			console.log('Error:', error);
		})

});

module.exports = router;