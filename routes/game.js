var express = require('express');
var router = express.Router();
var db = require('../routes/database');
var path = require('path');

//Routes.
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
		var maxPlayers = 2; //Update to switch statement with more map diversity.
		var currentPlayerTurn = 0;

		//Insert into DB.
		db.one('INSERT INTO games(title, map, totalTurns, totalPlayers, maxPlayers, currentPlayerTurn, started) VALUES($1, $2, $3, $4, $5, $6, FALSE) RETURNING *',
			[title, mapID, totalTurns, totalPlayers, maxPlayers, currentPlayerTurn])
			.then(data => {
				console.log('Success! Game added to DB:');
				console.log(data);
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
				throw error;
			});

	}
});

router.post('/join_game', function(req, res) {
	var username = req.user.username;
	var gameID = req.body.gameID;
	var userID = req.user.id;

	db.one('UPDATE games SET totalplayers = totalplayers+1 WHERE id = $1 RETURNING *', [gameID])
		.then(data => {
			console.log(username, 'added to players of game:', gameID, 'Current number of players:', data.totalplayers);

			if (data.totalplayers == data.maxplayers) {
				db.none('UPDATE games SET started = true WHERE id = $1', [gameID]);
			}
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
				if (!game) console.log('Error: No game found!');
				else {
					res.render('testGame', {game, unitList});
				}
			})
			
		}
	});
});

router.post('/rejoin_game', function(req, res) {
	var gameID = req.body.gameID;

	getGameByID(gameID, function(err, game, unitList) {
		if (err) throw err;
		if (!game) console.log('Error: No game found!');
		else {
			res.render('testGame', {game, unitList});
		}
	})
	
})

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
		.then(user => {
			console.log('Success', user.username, 'stored in player DB!');
			callback(null, user);
		})
		.catch(error => {
			callback(error, false);
		});
}


//Helper functions.
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
			callback(error, false, false);
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

//Exports
module.exports = router;

module.exports.getGameList = function(callback) {
	db.manyOrNone('SELECT * FROM games')
		.then(games => {
			db.manyOrNone('SELECT * FROM players')
				.then(players => {
					games.players = players;
					callback(null, games);
				})
				.catch(error => {
					callback(error, false);
				})
			
		})
		.catch(error => {
			callback(error, false);
		});
};

module.exports.getPlayerList = function(gameID, callback) {
	db.one('SELECT * FROM players WHERE gameID = $1', [gameID])
		.then(players => {
			console.log('Fetching playerlist for game', gameID, ':', players);
			callback(null, players);
		})
		.catch(error => {
			callback(error, false);
		})
}

module.exports.getGamesByUserID = function(userID, callback) {
	db.manyOrNone('SELECT * FROM players p INNER JOIN games g ON p.gameID = g.id WHERE p.id = $1', [userID])
		.then(games => {
			console.log('These games were found:', games);
			callback(null, games);

			/*
			db.manyOrNone('SELECT * FROM games WHERE id in $1', [players.gameID])
				.then(games => {
					console.log('These games were found:', games);
					callback(null, games);
				})
				.catch(error => {
					callback(error, false);
				})*/
		})
		.catch(error => {
			callback(error, false);
		})
}

router.get('refresh_game', function(req, res) {
})
