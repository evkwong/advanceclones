var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) { //Is next needed here?
  res.send('respond with a resource');
});

router.post('/register', function(req, res){
	//Do something.
	console.log('Post request to /users');
	console.log(req.method, req.url);
});

router.get('/login', function(req, res){
	//Do something.
});

module.exports = router;