var socketIo = require('socket.io')
//var { USER_JOINED, MESSAGE_SEND } = require('../chat/constants_chat')
var game = require('../routes/game');

console.log('SocketIO index loaded.');
var init = (app, server) => {
  var io = socketIo(server);
  
  app.set('io', io);
  
  let players = [];
  
  io.on('connection', socket => {
    console.log('A client connected.')
    
    //used for chat serverside       
    socket.on('send', function(data) {
      socket.emit('message', data);
    })

    //Game state.
    socket.on('test', function(data) {
      game.getGameList(null, function(err, gameList) {
        if (err) throw err
        else {
          console.log('Data received:', gameList);
        }
        
      });
      
    })
    
    //Disconnect.
    socket.on('disconnect', data => {
      console.log('A client disconnected.')
    })

  })
}

module.exports = {init}
