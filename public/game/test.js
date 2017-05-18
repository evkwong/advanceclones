/* TODO
 * get gameId, currentPlayerTurn, and unitId from database
 * 	these values are hard coded into the game right now
 */

var socket = io();
var testButton = document.getElementById('testButton');
var currentPlayerTurn = 0;
var canvas = document.getElementById('gameDraw');
var context = canvas.getContext('2d');
var background = new Image();
background.src = '/images/map_0.png';

var width = parseInt(background.width);
var height = parseInt(background.height);
canvas.width = width;
canvas.height = height;

var units = [];
var buildings = [];

window.onload = function() {
		var background = new Image();
		background.src = '/images/map_0.png';
		background.onload = function() {
				var width = parseInt(background.width);
				var height = parseInt(background.height);

				canvas.width = width;
				canvas.height = height;
				context.drawImage(background, 0, 0);
		};

		createBuilding(context, 0, 1, currentPlayerTurn, 1, 256, "hq");
		createBuilding(context, 1, 1, 1, 580, 1, "hq");
		createUnit(context, 2, 1, currentPlayerTurn, 1, 1, "infantry");
		createUnit(context, 1, 1, 1, 550, 1, "infantry");
		createUnit(context, 3, 1, currentPlayerTurn, 32, 1, "mech");
};

$('#gameDraw').on('click', selectUnit);
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
}	function orderUnit(selectedUnit) {
		$('#gameDraw').one('click', function(e) {
				selectedUnit.xPos = e.pageX - this.offsetLeft;
				selectedUnit.yPos = e.pageY - this.offsetTop;


				console.log('Attempting to get new xPos and yPos!');
				socket.emit('test', {unit: selectedUnit});


				for(var i in units) {
						if(units[i].id == selectedUnit.id) {
								units[i].xPos = selectedUnit.xPos;
								units[i].yPos = selectedUnit.yPos;
								break;
						}
				}

				updateAll();
				return;
		});
}

$('#gameDraw').on('click', selectBuilding);
function selectBuilding(e) {
		var clickedX = e.pageX - this.offsetLeft;
		var clickedY = e.pageY - this.offsetTop;

		console.log("x: ", clickedX, 'y:', clickedY);

		for(var i in buildings) {
				if(clickedX > buildings[i].xPos && clickedX < buildings[i].xPos + 32 &&
					 clickedY > buildings[i].yPos && clickedY < buildings[i].yPos + 64) {
							console.log("Clicked on building", buildings[i].xPos, buildings[i].yPos);
							buyUnits(buildings[i]);
				}
		}
} function buyUnits(selectedBuild) {
		drawBuyUnits(currentPlayerTurn);

		$('#gameDraw').one('click', function(e) {
				var clickedX = e.pageX - this.offsetLeft;
				var clickedY = e.pageY - this.offsetTop;

				if(clickedX > 160 && clickedX < 200 && clickedY > 256 && clickedY < 296) {
						createUnit(context, 1, 1, currentPlayerTurn, 
								selectedBuild.xPos + 32, selectedBuild.yPos, "infantry");
				}

				updateAll();
				return;
		});

} function drawBuyUnits(currentTurn) {
		var unitSide;

		context.fillStyle = "#ffffff";
		context.fillRect(160, 256, 40, 40);
		context.fillRect(225, 256, 40, 40);
		context.fillRect(287, 256, 40, 40);
		context.fillRect(353, 256, 40, 40);
		context.strokeRect(160, 256, 40, 40);
		context.strokeRect(225, 256, 40, 40);
		context.strokeRect(287, 256, 40, 40);
		context.strokeRect(353, 256, 40, 40);

		if(currentTurn == 0) {
				unitSide = "red";
		} else if(currentTurn == 1) {
				unitSide = "blue";
		}

		for(var i = 0; i < 3; i++) {
				var menuImage = new Image();
				var menuX;
				var menuY;

				if(i == 0) {
						menuImage.src = "/images/infantry_" + unitSide + ".png";
						menuX = 160;
						menuY = 256;
						context.drawImage(menuImage, menuX, menuY);
				}

				
				if(i == 1) {
						menuImage.src = "/images/mech_" + unitSide + ".png";
						menuX = 225;
						menuY = 256;
				}

				/*
				if(i == 2) {
						menuImage.src = "/images/recon_" + unitSide + ".png";
						menuX = 287;
						menuY = 256;
				}

				if(i == 3) {
						menuImage.src = "/images/tank_" + unitSide + ".png";
						menuX = 353;
						menuY = 256;
				}
				*/
		}

}

function updateAll() {
		context.drawImage(background, 0, 0);
		for(var i in units) {
				drawUnit(context, units[i]);
		}
		for(var i in buildings) {
				drawBuilding(context, buildings[i]);
		}
};

var drawUnit = function(context, unitObject) {
		var unitImage = new Image();
		
		if(unitObject.type == "infantry") {
				if(unitObject.owner == 0) {
						unitImage.src = "/images/infantry_red.png";
				}

				if(unitObject.owner == 1) {
						unitImage.src = "/images/infantry_blue.png";
				}
		}

		if(unitObject.type == "mech") {
				if(unitObject.owner == 0) {
						unitImage.src = "/images/mech_red.png";
				}

				if(unitObject.owner == 1) {
						unitImage.src = "/images/mech_blue.png";
				}
		}

		unitImage.onload = function() {
				context.drawImage(unitImage, unitObject.xPos, unitObject.yPos);
		}
};

var drawBuilding = function(context, buildObject) {
		var buildImage = new Image();

		if(buildObject.type == 'hq') {
				if(buildObject.owner == 0) {
						buildImage.src = "/images/hq_red.png";
				}

				if(buildObject.owner == 1) {
						buildImage.src = "/images/hq_blue.png";
				}
		}

		buildImage.onload = function() {
				context.drawImage(buildImage, buildObject.xPos, buildObject.yPos);
		}
}


var Building = function(buildId, gameId, owner, xPos, yPos, type) {
		this.buildId = buildId;
		this.gameId = gameId;
		this.owner = owner;
		this.xPos = xPos;
		this.yPos = yPos;
		this.type = type;
}

var Unit = function(id, gameId, owner, xPos, yPos, type) {
		this.id = id;
		this.xPos = xPos;
		this.yPos = yPos;
		this.gameId = gameId;
		this.owner = owner;
		this.type = type;
};

var createBuilding = function(context, buildId, gameId, owner, xPos, yPos, type) {
		var building = new Building(buildId, gameId, owner, xPos, yPos, type);
		drawBuilding(context, building);
		buildings.push(building);
};

var createUnit = function(context, id, gameId, owner, xPos, yPos, type) {
		var unit = new Unit(id, gameId, owner, xPos, yPos, type);
		drawUnit(context, unit);
		units.push(unit);
		socket.emit('createUnit', unit);
};

//Socket.io for updating game state.
testButton.onclick = function() {
  console.log('Attempting to send data!');
  socket.emit('test', {message: 'WOW IT WORKED!'});
};

socket.on('test', function(data) {
  console.log('Data received:', data);
  socket.emit('test', {message: 'Yup it fuckin worked.'});
});

socket.on('returnUnit', function(unit) {
	console.log('Received a unit back:', unit);
	//Implement unit creation / update here.
});

socket.on('removeUnit', function(unitID) {
	//Implement unit deletion here.
});

socket.on('returnPlayer', function(player) {
	//Implement player update here.
});

socket.on('updatePlayerTurn', function(currentPlayerTurn) {
	//Implement update current player turn here.
});
