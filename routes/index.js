var express = require('express');
var router = express.Router();
var game = require('./game');
var site = require('./site');

//Landing Page
router.get('/', function(req, res, next) {
  res.render('index.jade', { title: 'Advance Clones', user: req.user });
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
			res.render('lobby.jade', {title: 'Lobby', games: gameList, user: req.user});
		}

	});
});


router.get('/game', function(req, res, next) {
	res.render('testGame.jade', { title: 'Game', user: req.user});
});

//Create Game Page
router.get('/createGame', function(req, res, next) {
	res.render('createGame.jade', {title: 'Create Game', user: req.user});
});

router.get('/profile', function(req, res, next) {
	if (req.user) {
		var user = req.user;

		game.getGamesByUserID(user.id, function(err, games) {
			if (err) throw err;
			if (!games) res.render('profile.jade', {user: user});
			else res.render('profile.jade', {user: user, games: games});
		});
	}
	else {
		site.notLoggedIn(res);
	}
	
});

router.get('/logout', function (req, res, next) {
	console.log('HELLO!!');
	req.session.destroy(function (err) {
		site.loggedOut(res);
	});
});

module.exports = router;
