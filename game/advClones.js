var io;
var socket;

exports.initialize = function (indexIO, indexSocket) {
		io = indexIO;
		socket = indexSocket;

		socket.emit('Connected', {message: "Connected"});
}
