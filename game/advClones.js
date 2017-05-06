var io;
var socket;

exports.initialize = function (indexIO, indexSocket) {
		io = indexIO;
		socket = indexSocket;

		socket.emit('Connected', {message: "Connected"});

		socket.on('createGame', createGame);
		socket.on('joinGame', joinGame);
		socket.on('hostGame', hostGame);
}

function createGame()	{

}

function joinGame()	{

}

function hostGame()	{

}
