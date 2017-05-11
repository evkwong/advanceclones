var express = require('express');
var router = express.Router();
var game = require('./game');

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
	game.getGameList(function(err, data) {
		if (err) throw err;
		if (!data) console.log('Error: No data returned.');
		else {
			console.log('Thisis the data:', data);
			var gameList = data;
			console.log('Game List:', gameList);
			res.render('lobby.jade', { title: 'Lobby', games: gameList});
		}
	});
});

//Create Game Page
router.get('/createGame', function(req,res,next){
	res.render('createGame.jade', {title: 'Create Game'});
});

router.get('/test', function(req, res, next) {
  res.render('test.jade', {title: 'Test'});
});

router.get('/game', function(req, res, next) {
  res.render('testGame.jade', {title: 'GameRoom'});
});

module.exports = router;
