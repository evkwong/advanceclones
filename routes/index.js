var express = require('express');
var router = express.Router();

//Landing Page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Registration Page
router.get('/registration', function(req, res, next) {
  res.render('registration.jade', { title: 'Registration'});
});

//Lobby Page
router.get('/lobby', function(req,res, next) {
  res.render('lobby.jade', { title: 'Lobby'});
});

router.get('/test', function(req, res, next) {
  res.render('test.jade', {title: 'Test'});
});

module.exports = router;
