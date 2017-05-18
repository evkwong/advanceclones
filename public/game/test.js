/* TODO
 * get gameId, currentPlayerTurn, and unitId from database
 *	these values are hard coded into the game right now
 */

console.log('GameID:', gameID);

//SocketIO setup.
var socket = io();
var socketID = null;
socket.emit('getSocketInfo', gameID);
socket.on('socketInfo', function(data) {
	socketID = data.socketID;
})

//Game setup.
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

		setDefaultState();
};

$('#gameDraw').on('click', selectUnit);
function selectUnit(e) {
		var clickedX = e.pageX - this.offsetLeft;
		var clickedY = e.pageY - this.offsetTop;

		console.log("x: ", clickedX , 'y: ', clickedY);

		for(var i = 0; i < units.length; i++) { 
				if (clickedX > units[i].xPos && clickedX < units[i].xPos + 32 && 
						clickedY > units[i].yPos && clickedY < units[i].yPos + 32 &&
						units[i].owner == currentPlayerTurn) {
								console.log("Clicked on unit", units[i].xPos, units[i].yPos);
								orderUnit(units[i], i);
				}
		}
} function orderUnit(selectedUnit, unitPosInArray) {
		$('#gameDraw').one('click', function(e) {
				clickedX = e.pageX - this.offsetLeft;
				clickedY = e.pageY - this.offsetTop;
				var entireArray = 0;


				console.log('Attempting to get new xPos and yPos!');
				socket.emit('test', {unit: selectedUnit});


				for(var i in units) {
						if (clickedX > units[i].xPos && 
								clickedX < units[i].xPos + 32 && 
								clickedY > units[i].yPos && 
								clickedY < units[i].yPos + 32 && 
								selectedUnit.owner != units[i].owner ) {
								
								attackUnit(selectedUnit, unitPosInArray, i);
								break;
						}

						else if(!(clickedX > units[i].xPos && 
								clickedX < units[i].xPos + 32 && 
								clickedY > units[i].yPos && 
								clickedY < units[i].yPos + 32 )) {
								entireArray++;	
						}
				}

				if(entireArray > units.length - 1) {
						units[unitPosInArray].xPos = clickedX;
						units[unitPosInArray].yPos = clickedY;
				}

				updateAll();
				return;
		});
} function attackUnit(selectedUnit, attacking, receiving) {
		units[receiving].health -= units[attacking].damage;
		console.log("Health: ", units[receiving].health);
		units[attacking].xPos = units[receiving].xPos - 32;
		units[attacking].yPos = units[receiving].yPos;

		if(units[receiving].health < 0) {
				console.log("You ams Dead");
				units[attacking].xPos = units[receiving].xPos;
				units[attacking].yPos = units[receiving].yPos;
				units.splice(receiving, 1);
		}

		updateAll();
		return;
}

$('#gameDraw').on('click', selectBuilding);
function selectBuilding(e) {
		var clickedX = e.pageX - this.offsetLeft;
		var clickedY = e.pageY - this.offsetTop;

		for(var i in buildings) {
				if(clickedX > buildings[i].xPos && clickedX < buildings[i].xPos + 32 &&
					 clickedY > buildings[i].yPos && clickedY < buildings[i].yPos + 64 &&
						buildings[i].type == "hq" && buildings[i].owner == currentPlayerTurn) {
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
					//createUnit(context, 1, 1, currentPlayerTurn, 
					//	selectedBuild.xPos + 32, selectedBuild.yPos, "infantry");
				}

				if(clickedX > 225 && clickedX < 265 && clickedY > 256 && clickedY < 296) {
					//createUnit(context, 1, 1, currentPlayerTurn, 
						//selectedBuild.xPos + 32, selectedBuild.yPos, "mech");
				}

				if(clickedX > 287 && clickedX < 327 && clickedY > 256 && clickedY < 296) {
					//createUnit(context, 1, 1, currentPlayerTurn, 
					//	selectedBuild.xPos + 32, selectedBuild.yPos, "recon");
				}

				if(clickedX > 353 && clickedX < 393 && clickedY > 256 && clickedY < 296) {
					//createUnit(context, 1, 1, currentPlayerTurn, 
						//selectedBuild.xPos + 32, selectedBuild.yPos, "tank");
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

		for(var i = 0; i < 4; i++) {
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
						context.drawImage(menuImage, menuX, menuY);
				}

				
				if(i == 2) {
						menuImage.src = "/images/recon_" + unitSide + ".png";
						menuX = 287;
						menuY = 256;
						context.drawImage(menuImage, menuX, menuY);
				}

				if(i == 3) {
						menuImage.src = "/images/tank_" + unitSide + ".png";
						menuX = 353;
						menuY = 256;
						context.drawImage(menuImage,menuX, menuY);
				}
				
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

		if(unitObject.type == "recon") {
			if(unitObject.owner == 0) {
					unitImage.src = "/images/recon_red.png";
			}

			if(unitObject.owner == 1) {
					unitImage.src = "/images/recon_blue.png";
			}
		}

		if(unitObject.type == "tank") {
			if(unitObject.owner == 0) {
					unitImage.src = "/images/tank_red.png";
			}

			if(unitObject.owner == 1) {
					unitImage.src = "/images/tank_blue.png";
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

var Unit = function(id, gameID, owner, xPos, yPos, type) {
		this.id = id;
		this.xPos = xPos;
		this.yPos = yPos;
		this.gameID = gameID;
		this.owner = owner;
		this.type = type;

		if(this.type == "infantry") {
				this.health = 50;
				this.damage = 20;
		}
};

var createBuilding = function(context, gameId, owner, xPos, yPos, type) {
		var building = new Building(gameId, owner, xPos, yPos, type);
		drawBuilding(context, building);
		buildings.push(building);
};

var createUnit = function(context, gameID, owner, xPos, yPos, type) {
		var unit = new Unit(-1, gameID, owner, xPos, yPos, type);
		socket.emit('createUnit', unit, gameID);
};

socket.on('updatePlayerTurn', function(currentPlayerTurn) {
	//Implement update current player turn here.
});
function setDefaultState() {
		createBuilding(context, gameID, 0, 1, 256, "hq");
		createBuilding(context, gameID, 1, 577, 1, "hq");

		//Build Red Factory
		createBuilding(context, gameID, 0, 1, 230, "factory");
		createBuilding(context, gameID, 0, 36, 258, "factory");
		createBuilding(context, gameID, 0, 67, 292, "factory");

		//Build Blue Factory
		createBuilding(context, gameID, 1, 514, 38, "factory");
		createBuilding(context, gameID, 1, 512, 100, "factory");
		createBuilding(context, gameID, 1, 579, 101, "factory");

		//Build Neutral Building
		createBuilding(context, gameID, -1, 388, 163, "factory");
		createBuilding(context, gameID, -1, 99, 63, "city");
		createBuilding(context, gameID, -1, 229, 29, "city");
		createBuilding(context, gameID, -1, 228, 123, "city");
		createBuilding(context, gameID, -1, 228, 286, "city");
		createBuilding(context, gameID, -1, 261, 286, "city");
		createBuilding(context, gameID, -1, 324, 2, "city");
		createBuilding(context, gameID, -1, 357, 2, "city");
		createBuilding(context, gameID, -1, 389, 94, "city");
		createBuilding(context, gameID, -1, 547, 285, "city");

		//Default Units
		createUnit(context, gameID, currentPlayerTurn, 1, 1, "infantry");
		createUnit(context, gameID, 1, 550, 1, "infantry");
}

//Socket.io for updating game state.
testButton.onclick = function() {
  console.log('Attempting to send data!');
  socket.emit('test', {message: 'WOW IT WORKED!'});
};

socket.on('clientConsoleMessage', function(data) {
	console.log('Message received:', data.message);
})

socket.on('returnUnit', function(unit) {
		console.log('Unit sent back:', unit);
		var tempUnit = new Unit(unit.id, unit.gameid, unit.owner, unit.xpos, unit.ypos, unit.type);
		console.log('tempUnit:', tempUnit);
		drawUnit(context, tempUnit);
		units.push(tempUnit);
});

socket.on('removeUnit', function(unitID) {
	//Implement unit deletion here.
});

socket.on('returnPlayer', function(player) {
	//Implement player update here.
});
