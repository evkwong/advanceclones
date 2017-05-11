var canvas = document.getElementById("gameDraw");
var context = canvas.getContext("2d");;
var units[];

window.onload = function() {
		var background = new Image();
		background.src = "/images/map_0.png"
		background.onload = function() {
				context.drawImage(background, 10, 10);
		}
};

var drawUnit = function(context, gameId, owner, xPos, yPos, type) {
		
};


