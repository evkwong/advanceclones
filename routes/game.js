var express = require('express');
var router = express.Router();
var db = require('../routes/database');

router.post('/new_game', function(req, res){
	req.checkBody('title', 'A title for your game is required.').notEmpty();

	var errors = req.validationErrors();

	if(errors) {
		res.render('/', {
			errors:errors
		});
	}
	else {
		console.log('No errors. Attempting to store new game.');

		var title = req.body.title;
		var map = req.body.map;
		var totalTurns = 0;
		var totalPlayers = 1;
		var currentPlayerTurn = 1;

		db.query('INSERT INTO games(title, map, totalTurns, totalPlayers, currentPlayerTurn) VALUES($1, $2, $3, $4, $5);',
			[title, map, totalTurns, totalPlayers, currentPlayerTurn])
			.then(data => {
				req.flash('success', 'You have successfully registered! Please log in.');
			})
			.catch(error => {
				callback(error, false);
			})

		//Need to insert player 1 into DB

	}
});

router.post('/join_game');