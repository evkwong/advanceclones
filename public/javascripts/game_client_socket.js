window.onload = function() {
  console.log('Chat loaded!');
  
  var socket = io();
  var messages = [];
  //var field = document.getElementById('field');
  //var sendButton = document.getElementById('send');
  var testButton = document.getElementById('testButton');
  //var content = document.getElementById('content');
  
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
/*
  sendButton.onclick = sendMessage = function() {
    var text = field.value;
    socket.emit('send', {message: text});
    field.value = '';
  };*/

  //Game state.
  testButton.onclick = function() {
    console.log('Attempting to send data!');
    socket.emit('test', {message: 'WOW IT WORKED!'});
  };

}
/*
$(document).ready(function() {
  $('#field').keyup(function(e) {
     if(e.keyCode == 13) {
       sendMessage();
     }
  });
});*/


