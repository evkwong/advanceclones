var socketIo = require('socket.io')
//var { USER_JOINED, MESSAGE_SEND } = require('../chat/constants_chat')

var init = (app, server) => {
  var io = socketIo(server)
  
  app.set('io', io)
  
  let players = [];
  
  io.on('connection', socket => {
    console.log('client connected')
    
    //used for chat serverside       
    socket.on('send', function(data) {
      socket.emit('message', data);
    })

    //Game state.
    socket.on('test', function(data) {
      console.log('Data received:', data);
    })
    
    //Disconnect.
    socket.on('disconnect', data => {
      console.log('client disconnected')
    })
  })
}

module.exports = {init}
