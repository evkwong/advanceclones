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
				var username = req.user.username;
				var gameID = data.id;
				var userID = req.user.id;

				//Add user into DB as player 1.
				console.log('Attempting to add player to DB.');
				insertPlayer(username, gameID, userID, function(err, data) {
					if (err) throw err;
					if (!data) console.log('No data found.');
					else {
						//Send variables to game js.
						//res.send(path.basename('/images/map_' + map + '.png'));
						var mapPath = path.basename('/images/map_' + mapID + '.png');
						res.render('testGame', {title: title, mapPath: mapPath, gameID: gameID});
					}
				});
			})
			.catch(error => {
				throw err;
			});

	}
});

router.post('/join_game', function(req, res) {
	//Add user into DB.
	var username = req.user.username;
	var gameID = req.body.gameID;
	var userID = req.user.id;

	console.log('Attempting to add a player to existing game: GameID =', gameID);
	db.one('UPDATE games SET totalPlayers = totalPlayers + 1 WHERE id = $1', [gameID])
		.then(data => {
			console.log(username, 'added to players of game', gameID);
		})
		.catch(error => {
			throw error;
		})

	insertPlayer(username, gameID, userID, function(err, data) {
		if (err) throw err;
		if (!data) console.log('No data found.');
		else {
			console.log(username, 'has joined the game.');

			getGameByID(gameID, function(err, game, unitList) {
				if (err) throw err;
				if (!game) console.log('No game found!');
				else {
					res.render('testGame', {game, unitList});
				}
			})
			
		}
	});
});

var insertPlayer = function(username, gameID, userID, callback) {
	var username = username;
	var gameID = gameID;
	var userID = userID;
	var income = 1000;
	var wallet = 0;
	var co = 0;
	var specialMeter = 0;

	console.log("User to be added to player DB:", username, ", GameID:", gameID);
	db.one('INSERT INTO players(username, gameID, userID, income, wallet, co, specialMeter) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING username',
		[username, gameID, userID, income, wallet, co, specialMeter])
		.then(data => {
			console.log('Success', data.username, 'stored in player DB!');
			callback(null, data);
		})
		.catch(error => {
			callback(error, false);
		});
}

var getGameByID = function(gameID, callback) {
	db.one('SELECT * FROM games WHERE id = $1', [gameID])
		.then(data => {
			var unitList = getUnitsByGameID(gameID, function(err, unitList) {
				if (err) throw err;
				if (!unitList) console.log('No unit list found!');
				else {
					callback(null, data, unitList);
				}
			})
			
		})
		.catch(error => {
			callback(error, false);
		})
}

var getUnitsByGameID = function(gameID, callback) {
	db.manyOrNone('SELECT * FROM units WHERE gameID = $1', [gameID])
		.then(data => {
			callback(null, data);
		})
		.catch(error => {
			callback(error, false);
		})
}

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

/*
router.post('end_turn', function(req, res) {
	db.one('SELECT * FROM games WHERE id = $1', [req.gameID])
		.then(data => {
			console.log('Ending player ' + data.currentPlayerTurn + '\'s turn.');

		})
		.catch(error => {
			throw error;
		})
});*/

//Exports
module.exports = router;

module.exports.getGameList = function(callback) {
	db.manyOrNone('SELECT * FROM games')
		.then(data => {
			console.log('Fetching games list.');
			callback(null, data);
		})
		.catch(error => {
			callback(error, false);
		});
};

router.get('refresh_game', function(req, res) {
})
