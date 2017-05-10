const gameDraw = {
		canvas: document.getElementById("gameDraw"),
		context: null
}

$('#gameDraw').ready(() => {
		gameDraw.canvas.width = gameDraw.width;
		gameDraw.canvas.height = gameDraw.height;
		gameDraw.context = gameDraw.canvas.getContext("2d");

		})
});

var socket = (app, server) => {
		var io = socketIO(server);
		app.set('io', io);

		io.connect('connection', function(data) {
			console.log("Connected: ", data);	
		})
}

gameDraw.onload = function() {
		gameDraw.drawImage(background, 0, 0);
		gameDraw.fillStyle = "rbga(200, 0, 0, 0.5)";
		gameDraw.fillRect(0, 0, 500, 500);
};


