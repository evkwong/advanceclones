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
	
	io.on('connection', socket => {
		console.log('A client connected.')
		
		//used for chat serverside       
		socket.on('send', function(data) {
			socket.emit('message', data);
		})

		//Game state.
		socket.on('test', function(data) {
			console.log('Got data:', data);
			game.testFunction(data);

		});

		socket.on('createUnit', function(data) {
			console.log('Adding new unit to DB:', data);
			game.addUnit(data);
		})
		
		//Disconnect.
		socket.on('disconnect', data => {
			console.log('A client disconnected.')
		})

	})
}

module.exports = {init}
