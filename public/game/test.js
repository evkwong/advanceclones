window.onload = function() {
		var canvas = document.getElementById("gameDraw");
		var ctx = canvas.getContext("2d");
		var image = new Image();
		image.src = "/images/map_0.png"
		image.onload = function() {
				ctx.drawImage(image, 10, 10);
		}
};
