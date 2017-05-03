import { LOBBY, USER_JOINED, MESSAGE_SEND } from '../../chat/constants_chat'

var socket = io()

var appendMessage = message => {
  $('.messages').append(message)
}

var messageElement = ({user, message}) =>
  $( '<div>', {class: 'message'})
  .text(message)
  .prepend(userElement(user))

var userElement = userName =>
  $('<span>', {class: 'user'}).text(userName)[0]

var userJoined = data =>
  appendMessage(messageElement(Object.assign(data, {message: ' joined'})))

var messageReceived = data =>
  appendMessage(messageElement(
    Object.assign(data, {user: '${data.user} said'})
  )) //end messageReceived

var initializeSocket = () => {
  socket.on(USER_JOINED, userJoined)
  socket.on(MESSAGE_SEND, messageReceived)
} //end initializeSoscket

$(document).ready( () => {
  let user = 'anonymous'
  
  $('#initial-form button').click(event => {
    user = $('#who-are-you').val()
  
    $('#initial-fomr').hide()
    $('#chat-area').show()
 
    initializeSocket()
    socket.emit(USER_JOINED, {user})

    return false
  }) //end initial-form

  $('#chat-area button').click(event => {
    var message = $('#chat-area input').val()
    $('#chat-area input').val('')
 
    socket.emit(MESSAGE_SEND, {user, message})
  })//end chat-area
})//end frontend functionality 
