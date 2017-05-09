var express = require('express');
var router = express.Router();
var error;


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

//Create Game Page
router.get('/createGame', function(req,res,next){
	res.render('createGame.jade', {title: 'Create Game'});
});

//Flash Messages
if(error.length > 0){
	req.flash('error_messages', error);
	res.redirect('/');
}

module.exports = router;
