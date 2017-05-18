var socketIo = require('socket.io')
var game = require('../routes/game');
console.log('Game:', game);
//var { USER_JOINED, MESSAGE_SEND } = require('../chat/constants_chat')

game.testFunction('hi');

console.log('SocketIO index loaded.');
var init = (app, server) => {
	var io = socketIo(server);
	var room = null;
	
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
			io.to(room).emit('Socket:', socketID, 'connected to this room.');
		})

		//Chat. 
		socket.on('send', function(data) {
			socket.emit('message', data);
		})

		//Game state.
		socket.on('test', function(data) {
			console.log('Got data:', data);
		});

		socket.on('createUnit', function(data, room) {
			console.log('Adding new unit to DB:', data);
			game.addUnit(data, function(err, unit) {
				if (err) throw error;
				if (!data) console.log('No data returned.');
				else {
					console.log('Returning a', unit.type, 'to', room);
					io.to(room).emit('returnUnit', unit);
				}
			});
		});

		socket.on('removeUnit', function(data) {
			console.log('Removing unit from DB:', data);
			game.removeUnit(data, function(err, unitID) {
				if (err) throw error;
				else {
					socket.emit('removeUnit', unitID);
				}
			});
		});
		
		socket.on('updateWallet', function(data) {
			console.log('Updating wallet:', data);
			game.updateWallet(data, function(err, player) {
				if (err) throw error;
				else {
					socket.emit('updateWallet', player);
				}
			});
		});

		socket.on('updatePlayerTurn', function(currentPlayerTurn) {
			console.log('Updating player turn.');
			game.updatePlayerTurn(currentPlayerTurn, function(err, nextPlayerTurn) {
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
