var express = require('express');
var router = express.Router();
var db = require('../routes/database');
var path = require('path');


router.post('/new_game', function(req, res) {
	req.checkBody('title', 'A title for your game is required.').notEmpty();

	var errors = req.validationErrors();

	if(errors) {
		console.log(errors);
		res.render('lobby', {
			errors:errors
		});
	}
	else {
		console.log('No errors. Attempting to store new game.');

		var title = req.body.title;
		var mapID = req.body.map;
		var totalTurns = 0;
		var totalPlayers = 1;
		var currentPlayerTurn = 1;

		//Insert into DB.
		db.one('INSERT INTO games(title, map, totalTurns, totalPlayers, currentPlayerTurn) VALUES($1, $2, $3, $4, $5) RETURNING id',
			[title, mapID, totalTurns, totalPlayers, currentPlayerTurn])
			.then(data => {
				console.log('Success! Game added to DB.');

				//Add user into DB as player 1.
				console.log('Attempting to add player to DB.');
				var username = req.user.username;
				var gameID = data.id;
				var userID = req.user.id;
				var income = 1000;
				var wallet = 0;
				var co = 0;
				var specialMeter = 0;

				console.log("User to be added to player DB:", username, ", GameID:", gameID);
				db.one('INSERT INTO players(username, gameID, userID, income, wallet, co, specialMeter) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING username',
					[username, gameID, userID, income, wallet, co, specialMeter])
					.then(data => {
						console.log('Success', data.username, 'stored in player DB!');
					})
					.catch(error => {
						throw error;
					});
			})
			.catch(error =>{
				throw err;
			});

		//Send variables to game js.
		//res.send(path.basename('/images/map_' + map + '.png'));
		var mapPath = path.basename('/images/map_' + mapID + '.png');
		res.render('testGame', {title: title, mapPath: mapPath, mapID: map});

	}
});

router.post('/join_game', function(req, res) {
	//Add user into DB.
	var username = req.user.username;
	var gameID = req.body.gameID;
	var userID = req.user.id;
	var income = 1000;
	var wallet = 0;
	var co = 0;
	var specialMeter = 0;

	console.log(username, 'has joined the game.');

	res.render('testGame'); //Display game page.
});

/*
router.post('build_unit', function(req, res) {
	var gameID = req.body.gameID;
	var owner = req.body.player;
	var posX = req.body.posX;
	var posY = req.body.posY;
	var health = 0 //Set below.
	var type = req.body.type;

	unitType = db.oneOrNone('SELECT * FROM unitTypes WHERE id = $1;', [type])
		.catch(error => {
			throw error;
		});

	health = unitType.health;

	db.query('INSERT INTO units(gameID, owner, posX, posY, health, type) VALUES($1, $2, $3, $4, $5, $6);',
		[gameID, owner, posX, posY, health, type])
		.then(data => {
			console.log('Unit', unitType.name, 'added to list of in game units!');
		})
		.catch(error => {
			//throw error;
		})
});

router.post('move_unit', function(req, res) {
	var unitID = req.body.unitID;
	var xPos = req.body.xPos;
	var yPos = req.body.yPos;

	db.oneOrNone('UPDATE units SET xPos = $1, yPos = $2, WHERE id = $3;', [xPos, yPos, unitID])
		.catch(error => {
			throw error;
		});
});

router.post('update_health', function(req, res) {
	var unitID = req.body.unitID;
	var health = req.body.health;

	db.oneOrNone('UPDATE units SET health = $1 WHERE id = $2;', [health, unitID])
		.catch(error => {
			throw error;
		});
})

router.post('kill_unit', function(req, res) {
	var unitID = req.body.unitID;

	unitType = db.oneOrNone('DELETE FROM units WHERE id = $1;', [unitID])
		.catch(error => {
			throw error;
		});
});
*/

router.get('/images/map_0.png', function(req,res) {
		console.log(path.resolve(__dirname, '/images/map_0.png'));
		res.sendFile(path.resolve(__dirname, '/images/map_0.png'));
});

module.exports = router;

router.post('end_turn', function(req, res) {
	db.one('SELECT * FROM games WHERE')
});

//Exports
module.exports = router;

module.exports.getGameList = function(callback) {
	db.many('SELECT * FROM games')
		.then((data) => {
			console.log('Fetching games list.');
			callback(null, data);
		})
		.catch((error) => {
			callback(error, false);
		});
};

router.get('refresh_game', function(req, res) {
})
