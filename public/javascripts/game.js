var socket = io();

var background = new Image();
background.onload = function() {
  canvas.drawImage(background, 0, 0);
  canvas.fillStyle = 'rbga(200, 0, 0, 0.5)';
  canvas.fillRect(0, 0, 500, 500);
};

background.src = '/images/littleisle.png';
