var express = require('express');
//var db = require('./database');
var db = app.database;
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) { //Is next needed here?
  res.send('respond with a resource');
});

router.post('/register', function(req, res){
	//Do something.
	console.log('Post request to /users');
	const user = req.body;
	//var post = {id: 'DEFAULT', name: req.body.username, email: req.body.email, password: req.body.password, avatar: req.body.avatar};
	db.one('INSERT INTO users(id, name, email, password, avatar) VALUES($1, $2, $3, $4, $5) RETURNING name;', ['DEFAULT', user.username, user.email, user.password, user.avatar])
		.then(data => {
			console.log('Success!', data.id);
		})
		.catch(error => {
			console.log('Error:', error);
		})
});

router.get('/login', function(req, res){
	//Do something.
});

module.exports = router;