var express = require('express');
var router = express.Router();
var db = require('../routes/database');
var path = require('path');
var site = require('./site');

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
	if (req.user) {
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
	}
	else {
		site.notLoggedIn(res);
	}
});

router.post('/rejoin_game', function(req, res) {
	var gameID = req.body.gameID;

	getGameByID(gameID, function(err, game, unitList) {
		if (err) throw err;
		if (!game) console.log('Error: No game found!');
		else {
			res.render('testGame', {game: game, unitList: unitList});
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

module.exports.getGameList = function(user, callback) {
	db.manyOrNone('SELECT * FROM games')
		.then(games => {
			db.manyOrNone('SELECT * FROM players')
				.then(players => {
					//Check if a logged in user has any concurrent games.
					for (i = 0; i < games.length; i++) {
						games[i].playerInGame = false;
					}

					//Check if a logged in user has any concurrent games.
					if (user != null) {
						for (i = 0; i < players.length; i++) {
							for (j = 0; j < games.length; j++) {
								if (players[i].username == user.username && players[i].gameid == games[j].id) {
									games[j].playerInGame = true;
								}
							}
							
						}
					}

					console.log('Game list:', games);
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
};

module.exports.getGamesByUserID = function(userID, callback) {
	db.manyOrNone('SELECT * FROM players p, games g WHERE p.userid = $1 AND g.id = p.gameID', [userID])
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
};

//Update game state.
//Return data to be sent to other clients.
module.exports.addUnit = function(data, callback) {
	var gameID = data.gameID;
	var owner = data.owner;
	var posX = data.posX;
	var posY = data.posY;
	var health = 10;
	var type = 0;

	db.one('INSERT INTO units(gameid, owner, posx, posy, health, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
		[gameID, owner, posX, posY, health, type])
		.then(unit => {
			console.log('Unit inserted into DB.');
			callback(null, unit);
		})
		.catch(error => {
			callback(error, false);
		})
};

module.exports.removeUnit = function(data, callback) {
	var id = data.id;

	db.none('DELETE FROM units WHERE id = $1', [id])
		.then(unit => {
			console.log('Unit deleted from DB.');
			callback(null, id);
		})
		.catch(error => {
			callback(error, id);
		});
};

module.exports.updateWallet = function(data, callback) {
	var value = data.value;
	var playerID = data.playerID;

	db.one('UPDATE games SET wallet = wallet+$1 WHERE id = $2 RETURNING *', [value, playerID])
		.then(player => {
			console.log('Player wallet updated:', data.wallet);
			callback(null, player);
		})
		.catch(error => {
			callback(error, false);
		});
};

module.exports.updatePlayerTurn = function(data, callback) {
	if (data.currentplayerturn == 0) var nextPlayerTurn = 1;
	else var nextPlayerTurn = 0;
	var gameid = data.id;

	db.one('UPDATE games SET currentplayerturn = $1 WHERE id = $2', [nextplayerturn, gameid])
		.then(data => {
			callback(null, nextPlayerTurn);
		})
		.catch(error => {
			callback(error, nextPlayerTurn);
		})
}

module.exports.testFunction = function(data) {
	console.log('Got it:', data);
};
