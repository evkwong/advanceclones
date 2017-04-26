var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.jade', { title: 'Express' });
});

router.get('/registration', function(req, res, next) {
  res.render('registration.jade', { title: 'Registration'});
});

module.exports = router;
