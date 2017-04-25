var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res){
	//Do something.
});

router.get('/login', function(req, res){
	//Do something.
})

module.exports = router;