var canvas = document.getElementById('gameDraw');
var context = canvas.getContext('2d');
var units = [];

window.onload = function() {
		var background = new Image();
		background.src = '/images/map_0.png';
		background.onload = function() {
				context.drawImage(background, 0, 0);
		};

		drawInfantry(context, 1, 0, 1, 1, 'infantry');
};

var drawUnit = function(context, gameId, owner, xPos, yPos, type) {
		var unitImage = new Image();
		
		if(type == 'infantry') {
				if(owner == 0) {
						unitImage.src = "/images/infantry_red.png";
				}

				if(owner == 1) {
						unitImage.src = "/images/infantry_blue.png";
				}
		}

		unitImage.onload = function() {
				context.drawImage(unitImage, xPos, yPos);
		}
};

$('#gameDraw').click(function(clicking) {
		var clickedX = clicking.pageX - this.offsetLeft;
		var clickedY = clicking.pageY - this.offsetTop;

		console.log("x: ", clickedX , 'y: ', clickedY);

		for(var i = 0; i < units.length; i++) {
				if (clickedX > units[i].xPos && clickedX < units[i].xPos + 32 && 
						clickedY > units[i].yPos && clickedY < units[i].yPos + 32) {
						    console.log("Clicked on unit", units[i].xPos, units[i].yPos);
								orderUnit(units[i]);
				}
		}
});



var Infantry = function(gameId, owner, xPos, yPos, type) {
		this.xPos = xPos;
		this.yPos = yPos;
		this.gameId = gameId;
		this.owner = owner;
		this.type = type;
};

var drawInfantry = function(context, gameId, owner, xPos, yPos, type) {
		drawUnit(context, gameId, owner, xPos, yPos, type);
		var infantry = new Infantry(gameId, owner, xPos, yPos, type);
		units.push(infantry);
};


