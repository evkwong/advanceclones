window.onload = function() {
  
  var socket = io();
  var messages = [];
  var field = document.getElementById('field');
  var sendButton = document.getElementById('send');
  var testButton = document.getElementById('test');
  var content = document.getElementById('content');
  
  //Chat.
  socket.on('message', function (data) {
    if(data.message) {
      messages.push(data);
      var html = '';
      for(var i = 0; i < messages.length; i++) {
        html += messages[i].message + '<br />';
      }
     
      content.innerHTML = html;
    } else {
      console.log('not working', data);
    }
  });

  sendButton.onclick = sendMessage = function() {
    var text = field.value;
    socket.emit('send', {message: text});
    field.value = '';
  };

  //Game state.
  socket.on('test', function() {
    console.log('Sending data');
    socket.emit('test', {message: 'WOW IT WORKED!'});
  };

}

$(document).ready(function() {
  $('#field').keyup(function(e) {
     if(e.keyCode == 13) {
       sendMessage();
     }
  });
});
