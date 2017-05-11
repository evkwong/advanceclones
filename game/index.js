var socketIO = require('socket.io');
var advClones = require('./advClones');

var socket = (app, server) => {
		var io = socketIO(server);
		app.set('io', io);

		io.on('connection', function(client) {
				console.log('User connected');
				advClones.initialize(io, client);
				});
		});
}
