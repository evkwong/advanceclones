var express = require('express');
var router = express.Router();
var game = require('./game');
var site = require('./site.js');

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
	game.getGameList(req.user, function(err, gameList) {
		if (err) throw err;
		if (!gameList) console.log('Error: No data returned.');
		else {
			res.render('lobby.jade', {title: 'Lobby', games: gameList});
		}

	});
});

//Comment this out?
router.get('/game', function(req, res, next) {
	res.render('testGame.jade', { title: 'Game'});
});

//Create Game Page
router.get('/createGame', function(req, res, next) {
	res.render('createGame.jade', {title: 'Create Game'});
});

router.get('/profile', function(req, res, next) {
	if (req.user) {
		var userID = req.user.id;
		game.getGamesByUserID(userID, function(err, games) {
			if (err) throw err;
			if (!games) res.render('profile.jade', {user: req.user});
			else res.render('profile.jade', {user: req.user, games: games});
		});
	}
	else {
		site.notLoggedIn(res);
	}
	
});

module.exports = router;
