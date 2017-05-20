/* TODO
 * get gameID, currentPlayerTurn, and unitId from database
 *	these values are hard coded into the game right now
 */

console.log('GameID:', gameID);
console.log('You are player:', player);

//SocketIO setup.
var socket = io();
var socketID = null;
socket.emit('getSocketInfo', gameID);
socket.on('socketInfo', function(data) {
	socketID = data.socketID;
});

//Game setup.
var game = null;
var currentPlayerTurn = 0;
socket.emit('getGameInfo', gameID);
socket.on('gameInfo', function(data) {
	game = data.game;
	var unitList = data.unitlist;
	var buildingList = data.buildingList;
	console.log('Game data received:', game);
	//console.log('Unit list:', unitList);
	if (!game.started) {
		setDefaultState();
		socket.emit('startGame', gameID);
	}
	else
	{
		//Load current game state.
		currentPlayerTurn = game.currentplayerturn;

		//Load units.
		for (i = 0; i < unitList.length; i++) {
			unit = unitList[i];
			var tempUnit = new Unit(unit.id, unit.gameid, unit.owner, unit.xpos, unit.ypos, unit.type);
			addUnitToClient(tempUnit);
		}

		for (i = 0; i <  buildingList.length; i++) {
				building = buildingList[i]
				var tempBuild = new Building(building.id, building.gameid, building.owner, building.xpos, building.ypos, building.type);
				addBuildToClient(tempBuild);
		}
		
	}

	updatePlayerTurnDisplay();
});

//Map setup.
//0 = plains, 1 = forest, 2 = city, 3 = mountain, 4 = river, 5 = road, 6 = HQ.
var mapTerrain = [
[1, 1, 3, 3, 3, 4, 3, 3, 1, 0, 2, 2, 1, 4, 2, 2, 0, 5, 0],
[0, 0, 1, 3, 3, 4, 3, 2, 1, 0, 0, 0, 1, 4, 1, 0, 2, 5, 6],
[0, 0, 0, 2, 3, 4, 3, 0, 0, 0, 3, 5, 5, 5, 5, 5, 5, 5, 5],
[0, 0, 1, 3, 3, 4, 1, 0, 0, 3, 3, 5, 2, 4, 4, 2, 2, 5, 2],
[0, 1, 3, 3, 3, 4, 1, 2, 0, 3, 3, 5, 0, 3, 4, 0, 0, 5, 0],
[0, 0, 1, 1, 3, 4, 2, 0, 0, 3, 3, 5, 2, 3, 4, 1, 0, 5, 0],
[0, 0, 0, 1, 4, 4, 0, 0, 0, 3, 1, 5, 0, 3, 4, 1, 0, 5, 0],
[2, 0, 0, 0, 4, 0, 0, 0, 0, 3, 5, 5, 3, 3, 4, 1, 0, 5, 0],
[0, 2, 5, 5, 5, 5, 5, 5, 5, 5, 5, 3, 3, 3, 4, 3, 1, 5, 1],
[6, 0, 2, 0, 4, 1, 0, 2, 2, 1, 3, 3, 3, 3, 4, 3, 3, 2, 3]
]

var currentPlayerTurnDisplay = document.getElementById('currentPlayerTurnDisplay');
var endTurnButton = document.getElementById('endTurnButton');
var walletDisplay = document.getElementById('walletDisplay');
walletDisplay.innerHTML = 'Money: ' + player.wallet + ', Income: ' + player.income;

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
};

$('#gameDraw').on('click', selectThing);
function selectThing(e) {
		if(player.playernumber != currentPlayerTurn) {
				console.log("WAIT YOUR TURN! FOOL!");
				return;
		}

		var clickedX = e.pageX - this.offsetLeft;
		var clickedY = e.pageY - this.offsetTop;

		console.log("x: ", clickedX , 'y: ', clickedY);

		for(var i in units) { 
				if (clickedX > units[i].xPos && clickedX < units[i].xPos + 32 && 
						clickedY > units[i].yPos && clickedY < units[i].yPos + 32 &&
						units[i].owner == player.playernumber && units[i].moved == false) {
								console.log("Clicked on unit", units[i].xPos, units[i].yPos);
								orderUnit(units[i], i);
								break;
				}
		}
		for(var i in buildings) {
				if(clickedX > buildings[i].xPos && clickedX < buildings[i].xPos + 32 &&
					 clickedY > buildings[i].yPos && clickedY < buildings[i].yPos + 64 &&
						buildings[i].type == "hq" && buildings[i].owner == player.playernumber) {
							console.log("Clicked on building", buildings[i].xPos, buildings[i].yPos);
							buyUnits(buildings[i]);
							break;
				}

		}
} 

function orderUnit(selectedUnit, unitPosInArray) {
		$('#gameDraw').one('click', function(e) {
				clickedX = e.pageX - this.offsetLeft;
				clickedY = e.pageY - this.offsetTop;
				var entireArray = 0;

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

				for(var i in buildings) {
						if (clickedX > buildings[i].xPos &&
								clickedX < buildings[i].xPos + 32 &&
								clickedY > buildings[i].yPos &&
								clickedY < buildings[i].yPos + 32 &&
								selectedUnit.owner != buildings[i].owner &&
								buildings[i].type == "city") {

								captureBuilding(selectedUnit, i);
								break;
						}

						else if (clickedX > buildings[i].xPos &&
								clickedX < buildings[i].xPos + 32 &&
								clickedY > buildings[i].yPos &&
								clickedY < buildings[i].yPos + 64 &&
								selectedUnit.owner != buildings[i].owner &&
								buildings[i].type == "hq") {
									console.log("Macaroni");
									captureHeadquarters();
									return;
								}

				}

				if(entireArray > units.length - 1) {
						if(clickedX < units[unitPosInArray].xPos + units[unitPosInArray].distance && 
							clickedY < units[unitPosInArray].yPos + units[unitPosInArray].distance) {
								units[unitPosInArray].xPos = clickedX;
								units[unitPosInArray].yPos = clickedY;
								units[unitPosInArray].moved = true;
							}
				}

				//Socket io unit update.
				socket.emit('updateUnit', units[unitPosInArray], gameID);

				return;
		});
} function attackUnit(selectedUnit, attacking, receiving) {
		units[receiving].health -= units[attacking].damage;
		console.log("Health: ", units[receiving].health);
		units[attacking].xPos = units[receiving].xPos - 32;
		units[attacking].yPos = units[receiving].yPos;
		socket.emit('updateUnit', units[attacking], gameID);
		socket.emit('updateUnit', units[receiving], gameID);

		if(units[receiving].health < 0) {
				console.log("You ams Dead");
				units[attacking].xPos = units[receiving].xPos;
				units[attacking].yPos = units[receiving].yPos;
				socket.emit('removeUnit', units[receiving], gameID);
				socket.emit('updateUnit', units[attacking], gameID);
				units.splice(receiving, 1);
		}

		updateAll();
		return;
} function captureBuilding(selectedUnit, buildPos) {
		socket.emit('updateBuilding', buildings[buildPos], selectedUnit.owner, gameID);
}

function buyUnits(selectedBuild) {
		drawBuyUnits(currentPlayerTurn);

		$('#gameDraw').one('click', function(e) {
				var infantryPrice = 1000;
				var mechPrice = 3000;
				var reconPrice = 4000;
				var tankPrice = 7000;

				var clickedX = e.pageX - this.offsetLeft;
				var clickedY = e.pageY - this.offsetTop;

				var spawnX = 0;
				var spawnY = 0;

				if(currentPlayerTurn == 0) {
						spawnX = selectedBuild.xPos + 32;
						spawnY = selectedBuild.yPos;
				} 
				
				else if (currentPlayerTurn == 1) {
						spawnX = selectedBuild.xPos - 32;
						spawnY = selectedBuild.yPos;
				}

				if(clickedX > 160 && clickedX < 200 && clickedY > 256 && clickedY < 296 && player.wallet >= infantryPrice) {
						createUnit(context, gameID, currentPlayerTurn, spawnX, spawnY, "infantry");
						socket.emit("updateWallet", -infantryPrice, currentPlayerTurn, gameID);
				}

				if(clickedX > 225 && clickedX < 265 && clickedY > 256 && clickedY < 296 && player.wallet >= mechPrice) {
						createUnit(context, gameID, currentPlayerTurn, spawnX, spawnY, "mech");
						socket.emit("updateWallet", -mechPrice, currentPlayerTurn, gameID);
				}

				if(clickedX > 287 && clickedX < 327 && clickedY > 256 && clickedY < 296 && player.wallet >= reconPrice) {
						createUnit(context, gameID, currentPlayerTurn, spawnX, spawnY, "recon");
						socket.emit("updateWallet", -reconPrice, currentPlayerTurn, gameID);
				}

				if(clickedX > 353 && clickedX < 393 && clickedY > 256 && clickedY < 296 && player.wallet >= tankPrice) {
						createUnit(context, gameID, currentPlayerTurn, spawnX, spawnY, "tank");
						socket.emit("updateWallet", -tankPrice, currentPlayerTurn, gameID);
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

		var menuInfantry = new Image();
		menuInfantry.src = "/images/infantry_" + unitSide + ".png";
		menuInfantry.onload = function() {
				context.drawImage(menuInfantry, 160, 256);
		}

		var menuMech = new Image();
		menuMech.src = "/images/mech_" + unitSide + ".png";
		menuMech.onload = function() { 
				context.drawImage(menuMech, 225, 256);
		}

		var menuRecon = new Image();
		menuRecon.src = "/images/recon_" + unitSide + ".png";
		menuRecon.onload = function() {
				context.drawImage(menuRecon, 287, 256);
		}

		var menuTank = new Image();
		menuTank.src = "/images/tank_" + unitSide + ".png";
		menuTank.onload = function() {
				context.drawImage(menuTank, 353, 256);
		}				

};

function updateAll() {
		context.drawImage(background, 0, 0);
		for(var i in buildings) {
				buildings[i].xPos = snapRound(buildings[i].xPos);
				buildings[i].yPos = snapRound(buildings[i].yPos);
				drawBuilding(context, buildings[i]);
		}
		for(var i in units) {
				units[i].xPos = snapCeil(units[i].xPos);
				units[i].yPos = snapCeil(units[i].yPos);
				drawUnit(context, units[i]);
		}
};

function calculatePlayerIncome() {
		var totalIncome = 0;
		for(i in buildings) {
			if(buildings[i].owner == currentPlayerTurn) {
					totalIncome += 1000;
			}
		}

		return totalIncome;
}
function snapRound(value) {
	var result = Math.round(value / 32) * 32;
	if (result == 0) result++;

	return result;
}

function snapCeil(value) {
	var result = Math.floor(value / 32) * 32;
	if (result == 0) result++;

	return result;
}

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

		else if(buildObject.type == 'city' || buildObject.type == 'factory') {
				
				if(buildObject.owner == 0) {
						buildImage.src = "/images/city_red.png";
				}

				else if(buildObject.owner == 1) {
						buildImage.src = "/images/city_blue.png";
				}

				else if(buildObject.owner == -1) {
						buildImage.src = "/images/city_neutral.png";
				}
		}

		buildImage.onload = function() {
				context.drawImage(buildImage, buildObject.xPos, buildObject.yPos);
		}
}


var Building = function(id, gameID, owner, xPos, yPos, type) {
		this.id = id;
		this.gameID = gameID;
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
		this.moved = true;

		if(this.type == "infantry") {
				this.health = 1;
				this.damage = 1;
				this.distance = 96;
		}

		if(this.type == "mech") {
				this.health = 2;
				this.damage = 2;
				this.distance = 64;
		}

		if(this.type == "recon") {
				this.health = 3;
				this.damage = 1;
				this.distance = 256;
		}

		if(this.type == "tank") {
				this.health = 4;
				this.damage = 4;
				this.distance = 160;
		}
};

var createBuilding = function(context, gameID, owner, xPos, yPos, type) {
		var building = new Building(-1, gameID, owner, xPos, yPos, type);
		socket.emit('createBuilding', building, gameID);
};

var createUnit = function(context, gameID, owner, xPos, yPos, type) {
		var unit = new Unit(-1, gameID, owner, xPos, yPos, type);
		socket.emit('createUnit', unit, gameID);
};

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
		createBuilding(context, gameID, -1, 383, 159, "factory");
		createBuilding(context, gameID, -1, 96, 64, "city");
		createBuilding(context, gameID, -1, 223, 31, "city");
		createBuilding(context, gameID, -1, 223, 123, "city");
		createBuilding(context, gameID, -1, 223, 287, "city");
		createBuilding(context, gameID, -1, 255, 287, "city");
		createBuilding(context, gameID, -1, 319, 2, "city");
		createBuilding(context, gameID, -1, 351, 2, "city");
		createBuilding(context, gameID, -1, 383, 95, "city");
		createBuilding(context, gameID, -1, 543, 287, "city");

		//Default Units
		createUnit(context, gameID, currentPlayerTurn, 1, 1, "infantry");
		createUnit(context, gameID, 1, 550, 1, "infantry");

		updateAll();
}

//Socket.io for updating game state.
endTurnButton.onclick = function() {
  	console.log('Attempting to update player turn.');

  	var income = calculatePlayerIncome();
  	socket.emit('updateIncome', income, currentPlayerTurn, gameID);
  	socket.emit('updateWallet', income, currentPlayerTurn, gameID);

  	socket.emit('updatePlayerTurn', currentPlayerTurn, gameID);
};

socket.on('updatePlayerTurn', function(nextPlayerTurn) {
	console.log('Received new player turn from DB:', nextPlayerTurn);
	currentPlayerTurn = nextPlayerTurn;
	
	for(var i in units) {
		if (units[i].owner == currentPlayerTurn) {
			units[i].moved = false;
		}
	}

	updatePlayerTurnDisplay();
})

var updatePlayerTurnDisplay = function() {
	if (currentPlayerTurn == 0) {
		var playerColor = 'Red';
	}
	else {
		var playerColor = 'Blue';
	}

	currentPlayerTurnDisplay.innerHTML = playerColor + ' player\'s turn!';

	if (player.playernumber != currentPlayerTurn) {
		endTurnButton.style.visibility = 'hidden';
	}
	else {
		endTurnButton.style.visibility = 'visible';
	}
}

socket.on('updateWallet', function(updatedPlayer) {
	if (updatedPlayer.playernumber == player.playernumber) {
		player.wallet = updatedPlayer.wallet;
		player.income = updatedPlayer.income;
		walletDisplay.innerHTML = 'Money: ' + player.wallet + ', Income: ' + player.income;
	}
})

socket.on('clientConsoleMessage', function(data) {
	console.log('Message received:', data.message);
})

socket.on('returnUnit', function(unit) {
	var tempUnit = new Unit(unit.id, unit.gameid, unit.owner, unit.xpos, unit.ypos, unit.type);
	addUnitToClient(tempUnit);
});

socket.on('returnBuilding', function(building) {
	var tempBuild = new Building(building.id, building.gameid, building.owner, building.xpos, 
		building.ypos, building.type);
	addBuildToClient(tempBuild);
})

var addBuildToClient = function(building) {
	buildings.push(building);
	drawBuilding(context, building);
}
var addUnitToClient = function(unit) {
	units.push(unit);
	drawUnit(context, unit);
	
}

socket.on('updateUnit', function(unit) {
	console.log('Here are all the units:', units);
	for (i = 0; i < units.length; i++) {
		if (units[i].id == unit.id) {
			units[i].xPos = unit.xpos;
			units[i].yPos = unit.ypos;
			units[i].health = unit.health;
			units[i].moved = unit.moved;
		}
	}

	updateAll();
});


function captureHeadquarters() {
		console.log("Aay lmao");
		if(player.playernumber == currentPlayerTurn) {
				socket.emit("winner", gameID);
				//send them to winner url
				console.log("Winner");
				context.font = "48px Calibri";
				context.strokeText('HELLO WINNER', width/4, height/4);
		}

}
socket.on('loser', function() {
		//redirect to lose page
		context.font = "48px, Calibri";
		context.strokeText('HELLO LOSER', width/4, height/4);
})

socket.on('updateBuilding', function (building) {
		var tempBuilding = new Building(building.id, building.gameid, building.owner, building.xpos, building.ypos, building.type);

		for(var i in buildings) {
				if(buildings[i].id == tempBuilding.id) {
						buildings[i].owner = building.owner;
				}
		}

		updateAll();
});

socket.on('removeUnit', function(unitID) {
	//Implement unit deletion here.
});

socket.on('returnPlayer', function(player) {
	//Implement player update here.
});


//Chat functionality.
var messages = [];
var field = document.getElementById('field');
var sendButton = document.getElementById('send');
var content = document.getElementById('content');

socket.on('getChatMessage', function (data) {
	console.log('Chat data received from server:', data);
    if(data.message) {
		messages.push(data);
		var html = '';
		for(var i = 0; i < messages.length; i++) {
			html += messages[i].user + ': ' + messages[i].message + '<br />';
		}
		content.innerHTML = html;

    } else {
		console.log('Data did not contain a message:', data);
    }
});

sendButton.onclick = sendMessage = function() {
    var text = field.value;
    var user = player.username;
    socket.emit('sendChatMessage', {user: user, message: text}, gameID);
    field.value = '';
};

$(document).ready(function() {
	$('#field').keyup(function(e) {
 		if(e.keyCode == 13) {
   			sendMessage();
 		}
	});
});
