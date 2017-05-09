var socketIO = require('socket.io');

const gameDraw = {
		canvas: document.getElementById("gameDraw"),
		context: null;
}

$('#gameDraw').ready(() => {
		gameDraw.canvas.width = gameDraw.width;
		gameDraw.canvas.height = gameDraw.height;
		gameDraw.context = gameDraw.canvas.getContext("2d");
		
}

var document = $(document),
		window = $(window),
		canvas = document.getElementById('gameDraw').getContext('2d');

var socket = (app, server) => {
		var io = socketIO(server);
		app.set('io', io);

		io.connect('connection', function(data) {
			console.log("Connected: ", data);	
		})
}

var background = new Image();
background.onload = function() {
		canvas.drawImage(background, 0, 0);
		canvas.fillStyle = "rbga(200, 0, 0, 0.5)";
		canvas.fillRect(0, 0, 500, 500);
};

background.src = 'public/image/map_01.png';

