window.onload = function() {
		var canvas = document.getElementById("gameDraw");
		var ctx = canvas.getContext("2d");
		var image = document.getElementById("background");
		ctx.drawImage(image, 10, 10);
};
