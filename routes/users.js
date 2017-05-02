var express = require('express');
//var bcrypt = require('bcryptjs');
var db = require('./database');
var User = require('../models/user');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
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
		console.log('No errors. Attempting to store new user.');
		var username = req.body.username;
		var email = req.body.email;
		var password = req.body.password;
		var avatar = req.body.avatar;

		var user = new User(username, email, password, avatar);
		User.storeUser(user, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		console.log(user, 'successfully registered!');
		req.flash('success', 'You have registerd successfully.');
		res.redirect('../');

		//DEPRECATED CODE
		/*
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
		*/
	}
});

//User login.
passport.use(new LocalStrategy(
  function(username, password, done) {
  	User.getByUsername(username, function(err, user) {
  		if(err) throw err;

  		if(!user) {
  			return done(null, false, {message: 'Incorrect username.'});
  		}

		//Checks password if a user is returned without errors.
  		User.checkPassword(user, password, function(err, success) {
  			if(err) throw err;

  			if(success) {
  				console.log('User successfully logged in:', user.username);
  				return done(null, user);
  			}
  			else {
  				return done(null, false, {message: 'Incorrect password.'})
  			}
  		});
  	});

  	//DEPRICATED CODE
  	/*
	    db.one('SELECT * FROM users WHERE name = $1;', [username])
			.then(data => {
				if (password == data.password){
					console.log('Logged in!');

					//var user = new User(username, email, avatar);
				}
				else {
					console.log('Login fail!');
					return done(null, false, {message: 'Incorrect password.'});
				}
			})
			.catch(error => {
				console.log('Error:', error);
				return done(null, false, {message: 'User does not exist.'});
			})


	      return done(null, user);
      */
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getByID(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
	passport.authenticate('local', {successRedirect:'/lobby', failureRedirect:'/', failureFlash: true}), 
	function(req, res){
		
});

module.exports = router;