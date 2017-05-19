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
		socket.on('send', function(data) {
			socket.emit('message', data);
		})

		//Game state.
    socket.on('getGameInfo', function(gameID) {
      game.getGameByID(gameID, function(err, game) {
        if (err) throw err;
        else {
          socket.emit('gameInfo', game);
        }
      })
    })

		socket.on('startGame', function(gameID) {
      console.log('Attempting to start game', gameID);
      game.startGame(gameID);
    })

		socket.on('createUnit', function(data, room) {
			console.log('Received unit from client:', data);
      console.log('Room:', room);
			game.addUnit(data, room, function(err, unit) {
				if (err) throw err;
				if (!data) console.log('No data returned.');
				else {
					console.log('Returning', unit, 'to', room);
					io.to(room).emit('returnUnit', unit);
				}
			});
		});

    socket.on('createBuilding', function(data, room) {
      console.log('Received unit from client:', data);

    })

		socket.on('removeUnit', function(data) {
			console.log('Removing unit from DB:', data);
			game.removeUnit(data, function(err, unitID) {
				if (err) throw err;
				else {
					socket.emit('removeUnit', unitID);
				}
			});
		});
		
		socket.on('updateWallet', function(data) {
			console.log('Updating wallet:', data);
			game.updateWallet(data, function(err, player) {
				if (err) throw err;
				else {
					socket.emit('updateWallet', player);
				}
			});
		});

		socket.on('updatePlayerTurn', function(data) {
			console.log('Updating player turn.', data);
			game.updatePlayerTurn(data, function(err, nextPlayerTurn) {
				if (err) throw err;
				else {
					socket.emit('updatePlayerTurn', nextPlayerTurn);
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
