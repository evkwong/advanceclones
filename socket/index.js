var socketIo = require('socket.io')
var game = require('../routes/game');
console.log('Game:', game);
//var { USER_JOINED, MESSAGE_SEND } = require('../chat/constants_chat')

game.testFunction('hi');

console.log('SocketIO index loaded.');
var init = (app, server) => {
	var io = socketIo(server);
	
	app.set('io', io);
	
	let players = [];
	
	io.on('connection', function(socket) {
		console.log('A client connected.')

		//Store and return socketID.
		socket.on('getSocketInfo', function(gameID) {
			var room = gameID;
			socket.join(room);
			console.log(socket.id, 'has joined room:', room);
			socket.send('socketInfo', {socketID: socket.id});
			io.to(room).emit('clientConsoleMessage', {message: 'A socket connected to this room.'});
		})

		//Chat. 
		socket.on('sendChatMessage', function(data, gameID) {
			console.log('Chat data received:', data);
			io.to(gameID).emit('getChatMessage', data);
		})

		//Game state.
	    socket.on('getGameInfo', function(gameID) {
	      game.getGameByID(gameID, function(err, game, unitList, buildingList) {
	        if (err) throw err;
	        else {
	          socket.emit('gameInfo', {game: game, unitlist: unitList, buildingList});
	        }
	      })
	    })

		socket.on('startGame', function(gameID) {
	      console.log('Attempting to start game', gameID);
	      game.startGame(gameID);
	    })

		socket.on('createUnit', function(data, gameID) {
			console.log('Received unit from client:', data);
  			console.log('Room:', gameID);
			game.addUnit(data, gameID, function(err, unit) {
				if (err) throw err;
				if (!data) console.log('No data returned.');
				else {
					console.log('Returning', unit, 'to', gameID);
					io.to(gameID).emit('returnUnit', unit);
				}
			});
		});

		socket.on('updateUnit', function(data, gameID) {
			console.log('Unit to be updated received:', data);
			game.updateUnit(data, gameID, function(err, unit) {
				if (err) throw err;
				else {
					io.to(gameID).emit('updateUnit', unit);
				}
			});
		});

		socket.on('createBuilding', function(data, gameID) {
			console.log('Received building from client:', data);
			game.addBuilding(data, gameID, function(err, building) {
				if (err) throw err;
				else {
					console.log('Returning', building, 'to', gameID);
					io.to(gameID).emit('returnBuilding', building);
				}
			});
});

		socket.on('updateBuilding', function(data, unitOwner, gameID) {
				console.log('Building to be updated received: ', data);
				game.updateBuilding(data, unitOwner, gameID, function(err, building) {
					if (err) throw err;
					else {
						io.to(gameID).emit('updateBuilding', building);
					}
				});
		});

		socket.on('removeUnit', function(data, gameID) {
			console.log('Removing unit from DB:', data);
			game.removeUnit(data, function(err, unitID) {
				if (err) throw err;
				else {
					io.to(gameID).emit('removeUnit', unitID);
				}
			});
		});
		
		socket.on('updateWallet', function(data, gameID) {
			console.log('Updating wallet:', data);
			game.updateWallet(data, function(err, player) {
				if (err) throw err;
				else {
					io.to(gameID).emit('updateWallet', player);
				}
			});
		});

		socket.on('updatePlayerTurn', function(currentPlayerTurn, gameID) {
			console.log('Updating player turn for game:', currentPlayerTurn);
			game.updatePlayerTurn(currentPlayerTurn, gameID, function(err, nextPlayerTurn) {
				if (err) throw err;
				else {
					io.to(gameID).emit('updatePlayerTurn', nextPlayerTurn);
				}
			})
		});

		//Disconnect.
		socket.on('disconnect', data => {
			console.log('A client disconnected.')
		});

	})
}

module.exports = {init}
