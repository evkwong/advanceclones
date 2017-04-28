var express = require('express');
var db = require('./database');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) { //Is next needed here?
  res.send('respond with a resource');
});

router.post('/register', function(req, res){
	//Do something.
	console.log('Post request to /users');
	const user = req.body;
	req.checkBody('name', 'Name is required.').notEmpty();
	req.checkBody('email', 'Email is required.').notEmpty();
	req.checkBody('email', 'That is not a valid email.').isEmail();
	req.checkBody('password', 'Password is required.').notEmpty();
	req.checkBody('password2', 'Passwords do not match.').equals(user.password);

	var errors = req.validationErrors();

	if (errors) {
		res.render('registration', {
			errors:errors
		});
	}
	else {
		console.log('No errors.');
	}

	db.one('INSERT INTO users(name, email, password, avatar) VALUES($1, $2, $3, $4) RETURNING name;', [user.username, user.email, user.password, user.avatar])
		.then(data => {
			console.log('Success!', data.id);
			//req.flash('success_msg', 'You have successfully registered!'); //Install flash.
			res.redirect('/');
		})
		.catch(error => {
			console.log('Error:', error);
		})
});

router.post('/login', function(req, res){
	//Login logic.
});

module.exports = router;