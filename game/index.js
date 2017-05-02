var express = require('express');
var path = require('path');
var app = express();
var advclones = require('./advclones');

var server = require('http').createServer(app).listen(process.env.PORT || 3001);

var io = require('socket.io').listen(server);

io.sockets.on('connection', function(socket)) {
		advclones.initialize(io, socket);
}
