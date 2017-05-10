var socketIo = require('socket.io')
//var { USER_JOINED, MESSAGE_SEND } = require('../chat/constants_chat')

var init = (app, server) => {
  var io = socketIo(server)
  
  app.set('io', io)
  
  let players = [];
  
  io.on('connection', socket => {
    console.log('client connected')
      
      socket.on('chat message', function(msg){
        io.emit('chat message', msg);
      });

    socket.on('disconnect', data => {
      console.log('client disconnected')
    })

    socket.on('createGame', function(data){
      console.log(data);
      var name = data.players;
      var numPlayers = data.name;
      var mapNum = data.map;
      console.log(mapNum);
      socket.broadcast.emit('addGameToLobby', {name, numPlayers, mapNum});
    })
    
   /* socket.on('connectGame', function(){
      socket.join("game");
      console.log("player joins a game");
      players.push(socket);
      console.log(players.length);
   })*/
       

   // socket.on(USER_JOINED, data => io.emit(USER_JOINED, data))
   // socket.on(MESSAGE_SEND, data => io.emit(MESSAGE_SEND, data))
  })
}

module.exports = {init}
