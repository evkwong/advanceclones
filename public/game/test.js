var canvas = document.getElementById('gameDraw');
var context = canvas.getContext('2d');
var background = new Image();
background.src = '/images/map_0.png';
var units = [];

window.onload = function() {
		background.onload = function() {
				context.drawImage(background, 0, 0);
		};

		drawInfantry(context, 1, 1, 0, 1, 1, 'infantry');
};

var drawUnit = function(unitObject) {
		var unitImage = new Image();
		
		if(unitObject.type == 'infantry') {
				if(unitObject.owner == 0) {
						unitImage.src = "/images/infantry_red.png";
				}

				if(unitObject.owner == 1) {
						unitImage.src = "/images/infantry_blue.png";
				}
		}

		unitImage.onload = function() {
				context.drawImage(unitImage, unitObject.xPos, unitObject.yPos);
		}
};

$('#gameDraw').click(selectUnit);

function selectUnit(e) {
		var clickedX = e.pageX - this.offsetLeft;
		var clickedY = e.pageY - this.offsetTop;

		console.log("x: ", clickedX , 'y: ', clickedY);

		for(var i = 0; i < units.length; i++) {
				if (clickedX > units[i].xPos && clickedX < units[i].xPos + 32 && 
						clickedY > units[i].yPos && clickedY < units[i].yPos + 32) {
						    console.log("Clicked on unit", units[i].xPos, units[i].yPos);
								orderUnit(units[i]);
				}
		}
}

function orderUnit(selectedUnit) {
		$('#gameDraw').click(function(e) {
				selectedUnit.xPos = e.pageX - this.offsetLeft;
				selectedUnit.yPos = e.pageY - this.offsetTop;

				for(var i in units) {
						if(units[i].id == selectedUnit.id) {
								units[i].xPos = selectedUnit.xPos;
								units[i].yPos = selectedUnit.yPos;
								break;
						}
				}

				updateAll();
		});
}

function updateAll() {
		context.drawImage(background, 0, 0);
		for(var i in units) {
				drawUnit(units[i]);
		}
}

var Infantry = function(id, gameId, owner, xPos, yPos, type) {
		this.id = id;
		this.xPos = xPos;
		this.yPos = yPos;
		this.gameId = gameId;
		this.owner = owner;
		this.type = type;
};

var drawInfantry = function(context, id, gameId, owner, xPos, yPos, type) {
		var infantry = new Infantry(id, gameId, owner, xPos, yPos, type);
		drawUnit(infantry);
		units.push(infantry);
};


