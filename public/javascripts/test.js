var socket = io();

var a = '2';
var b = 'TestRoom';
var c = 1;

$(document).ready(function () {
  $('#create-game button').click(function(event) {
     socket.emit('createGame', { 'players' : a, 'name' : b, 'map' : c});
  })
})

/*function move() {
  window.location.href = '/game'
}*/
