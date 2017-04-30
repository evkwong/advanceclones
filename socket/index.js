var socketIo = require('socket.io')
var { USER_JOINED, MESSAGE_SEND } = require('../chat/constants_chat')

var init = (app, server) => {
  var io = socketIo(server)
  
  app.set('io', io)
  
  io.on('connection', socket => {
    console.log('client connected')
  
    socket.on('disconnect', data => {
      console.log('client disconnected')
    })

    socket.on(USER_JOINED, data => io.emit(USER_JOINED, data))
    socket.on(MESSAGE_SEND, data => io.emit(MESSAGE_SEND, data))
  })
}

module.exports = {init}
