var express = require('express');
var router = express.Router();
var db = require('../routes/database');
var User = require('../models/user')

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
				throw error;
			})


		//Add user into DB as player 1.
		var username = User.username;
		var gameID = 0; //Get game ID from table above.
		var userID = User.id;
		var income = 1000;
		var wallet = 0;
		var co = 0;
		var specialMeter = 0;

		console.log(User.username, 'has joined the game as player 1.');

		/*
		db.query('INSERT INTO players(username, gameID, userID, income, wallet, co, specialMeter) VALUES($1, $2, $3, $4);',
				[username, gameID, userID, income, wallet, co, specialMeter])
				.then(data => {
					console.log('Success, player stored in DB.');
				})
				.catch(error => {
					callback(error, false);
				})*/

	}
});

router.post('/join_game', function(req, res) {
	//Add user into DB as player 1.
	var username = User.username;
	var gameID = req.body.gameID; //Get game ID from table above.
	var userID = User.id;
	var income = 1000;
	var wallet = 0;
	var co = 0;
	var specialMeter = 0;

	console.log(User.username, 'has joined the game');

	res.render('game'); //Display game page.
});

router.post('build_unit', function(req, res) {
	var gameID = req.body.gameID;
	var owner = req.body.player;
	var posX = req.body.posX;
	var posY = req.body.posY;
	var health = 0 //Set below.
	var type = req.body.type;

	unitType = db.oneOrNone('SELECT * FROM unitTypes WHERE id = $1;', [type]);
		/*.then(data => {
		})
		.catch(error => {
			throw error;
		});*/

	health = unitType.health;

	db.query('INSERT INTO units(gameID, owner, posX, posY, health, type) VALUES($1, $2, $3, $4, $5, $6);',
		[gameID, owner, posX, posY, health, type])
		.then(data => {
			console.log('Unit', unitType.name, 'added to list of in game units!');
		})
		.catch(error => {
			throw error;
		})
	}
});

router.post('move_unit', function(req, res) {
	var unitID = req.body.unitID;
	var xPos = req.body.xPos;
	var yPos = req.body.yPos;

	db.oneOrNone('UPDATE units SET xPos = $1, yPos = $2, WHERE id = $3;', [xPos, yPos, unitID]);
});

router.post('update_health', function(req, res) {
	var unitID = req.body.unitID;
	var health = req.body.health;

	db.oneOrNone('UPDATE units SET health = $1 WHERE id = $2;', [health, unitID]);
})

router.post('kill_unit', function(req, res) {
	var unitID = req.body.unitID;

	unitType = db.oneOrNone('DELETE FROM units WHERE id = $1;', [unitID]);
});