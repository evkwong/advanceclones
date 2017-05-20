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
				var playerNumber = 0;

				//Add user into DB as player 1.
				console.log('Attempting to add player to DB.');
				insertPlayer(username, gameID, userID, playerNumber, function(err, player) {
					if (err) throw err;
					if (!player) console.log('No player found.');
					else {
						//Send variables to game js.
						//res.send(path.basename('/images/map_' + map + '.png'));
						var mapPath = path.basename('/images/map_' + mapID + '.png');
						res.render('testGame', {title: title, mapPath: mapPath, gameID: gameID, player: player, user: req.user});
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
		var playerNumber = 1;

		db.one('SELECT * FROM games WHERE id = $1', [gameID])
			.then(game => {
				if (game.totalplayers < game.maxplayers) {
					db.one('UPDATE games SET totalplayers = totalplayers+1 WHERE id = $1 RETURNING *', [gameID])
						.then(data => {
							insertPlayer(username, gameID, userID, playerNumber, function(err, player) {
								if (err) throw err;
								if (!player) console.log('No player found.');
								else {
									console.log(username, 'has joined the game.');

									getGameByID(gameID, function(err, game, unitList, buildingList) {
										if (err) throw err;
										if (!game) console.log('Error: No game found!');
										else {
											res.render('testGame', {title: game.title, gameID: gameID, player: player, user: req.user});
										}
									})
									
								}
							});
						})
						.catch(error => {
							throw error;
						})
				}
				else {
					site.gameFull();
				}
			})
			.catch(error => {
				throw error;
			})
	}
	else {
		site.notLoggedIn(res);
	}
});

router.post('/rejoin_game', function(req, res) {
	var gameID = req.body.gameID;
	var userID = req.user.id;

	db.one('SELECT * FROM players WHERE gameID = $1 AND userID = $2', [gameID, userID])
		.then(player => {
			getGameByID(gameID, function(err, game, unitList, buildingList) {
				if (err) throw err;
				if (!game) console.log('Error: No game found!');
				else {
					res.render('testGame', {title: game.title, gameID: gameID, player: player, user: req.user});
				}
			})
		})
		.catch(error => {
			throw error;
		})
})

router.post('/delete_game', function(req, res) {
	var gameID = req.body.gameID;

	db.one('DELETE FROM games WHERE id = $1 RETURNING *', [gameID])
		.then(game => {
			console.log('Game', game.id, 'removed from DB.');

			db.none('DELETE FROM players WHERE gameid = $1', [game.id])
				.then(data => {
					console.log('Deleted players.');
					res.redirect('/lobby');
				})
				.catch(error => {
					throw error;
				})
		})
		.catch(error => {
			throw error;
		});
});


//Helper functions.
var insertPlayer = function(username, gameID, userID, playerNumber, callback) {
	var username = username;
	var gameID = gameID;
	var userID = userID;
	var playerNumber = playerNumber;
	var income = 4000;
	var wallet = 4000;
	var co = 0;
	var specialMeter = 0;

	console.log("User to be added to player DB:", username, ", GameID:", gameID);
	db.one('INSERT INTO players(username, gameID, userID, playerNumber, income, wallet, co, specialMeter) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
		[username, gameID, userID, playerNumber, income, wallet, co, specialMeter])
		.then(user => {
			console.log('Success', user.username, 'stored in player DB!');
			callback(null, user);
		})
		.catch(error => {
			callback(error, false);
		});
}

var getUnitsByGameID = function(gameID, callback) {
	db.manyOrNone('SELECT * FROM units u, unittypes t WHERE gameID = $1 AND u.type = t.type', [gameID])
		.then(data => {
			console.log('Modified units:', data);
			callback(null, data);
		})
		.catch(error => {
			callback(error, false);
		})
}

var getBuildingsByGameID = function(gameID, callback) {
	db.manyOrNone('SELECT * FROM buildings WHERE gameID = $1', [gameID])
		.then(data => {
			callback(null, data);
		})
		.catch(error => {
			callback(error, false);
		})
}

//Exports
module.exports = router;

module.exports.getGameByID = getGameByID = function(gameID, callback) {
	db.one('SELECT * FROM games WHERE id = $1', [gameID])
		.then(data => {
			getUnitsByGameID(gameID, function(err, unitList) {
				if (err) throw err;
				else {
					getBuildingsByGameID(gameID, function(err, buildingList) {
						if (err) throw err;
						else {
							callback(null, data, unitList, buildingList);
						}
					})
					
				}
			})
			
		})
		.catch(error => {
			callback(error, false, false);
		})
}

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
module.exports.startGame = function(gameID) {
	db.none('UPDATE games SET started = TRUE WHERE id = $1', [gameID])
		.then(data => {
			console.log('Game', gameID, 'started.');
		})
		.catch(error => {
			throw error;
		})
}

module.exports.addUnit = function(data, gameID, callback) {
	var owner = data.owner;
	var xPos = data.xPos;
	var yPos = data.yPos;
	var health = 10; //Get health from DB.
	var type = data.type;

	db.one('INSERT INTO units(gameid, owner, xpos, ypos, health, type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
		[gameID, owner, xPos, yPos, health, type])
		.then(unit => {
			console.log('Unit inserted into DB:', unit);
			callback(null, unit);
		})
		.catch(error => {
			callback(error, false);
		})
};

module.exports.addBuilding = function(data, gameID, callback) {
	var owner = data.owner;
	var xPos = data.xPos;
	var yPos = data.yPos;
	var type = data.type;

	db.one('INSERT INTO buildings(gameid, owner, xpos, ypos, type) VALUES ($1, $2, $3, $4, $5) RETURNING *', [gameID, owner, xPos, yPos, type])
		.then(building => {
			console.log('Stored a building in the DB:', building);
			callback(null, building);
		})
		.catch(error => {
			callback(error, false);
		})
}

module.exports.updateBuilding = function(data, unitOwner, gameID, callback) {
		var newBuildingOwner = unitOwner;
		var buildingID = data.id;

		db.one('UPDATE buildings SET owner = $1 WHERE id = $2 RETURNING *', [newBuildingOwner, buildingID])
				.then(building => {
					console.log('The building has been updated:', building);
					callback(null, building);
				})
				.catch(err => {
					callback(err, false);
				})
}

module.exports.updateUnit = function(data, gameID, callback) {
	var unitID = data.id;
	var xPos = data.xPos;
	var yPos = data.yPos;
	var health = data.health;

	db.one('UPDATE units SET xpos = $1, ypos = $2, health = $3 WHERE id = $4 RETURNING *', [xPos, yPos, health, unitID])
		.then(unit => {
			console.log('The unit has been updated:', unit);
			callback(null, unit);
		})
		.catch(err => {
			callback(err, false);
		})
}

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

module.exports.updateIncome = function(income, playerNumber, gameID, callback) {
	db.one('UPDATE players SET income = $1 WHERE playernumber = $2 AND gameid = $3 RETURNING *', [income, playerNumber, gameID])
		.then(player => {
			console.log('Player from game', gameID, 'income updated.');
			callback(null, player);
		})
		.catch(error => {
			callback(error, false);
		})
}

module.exports.updateWallet = function(playerID, gameID, callback) {
	db.one('UPDATE players SET wallet = wallet + income WHERE playerid = $1 AND gameid = $2 RETURNING *', [playerID, gameID])
		.then(player => {
			console.log('Player wallet updated:', player);
			callback(null, player);
		})
		.catch(error => {
			callback(error, false);
		});
};

module.exports.updatePlayerTurn = function(currentPlayerTurn, gameID, callback) {
	if (currentPlayerTurn == 0) var nextPlayerTurn = 1;
	else var nextPlayerTurn = 0;

	db.none('UPDATE games SET currentplayerturn = $1 WHERE id = $2', [nextPlayerTurn, gameID])
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
