var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) { //Is next needed here?
  res.send('respond with a resource');
});

router.post('/register', function(req, res){
	//Do something.
	console.log('Post request to /users');
	console.log('Username is:', req.body.username, 'Password is:', req.body.password);
});

router.get('/login', function(req, res){
	//Do something.
});

module.exports = router;