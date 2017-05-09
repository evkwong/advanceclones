$(document).ready(function () {
  $('#join button').click(function(event) {
     socket.emit('connectGame');
  })
})
