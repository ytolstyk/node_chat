$(function () {
  var socket = io('http://localhost');
  var chat = new ChatNamespace.Chat(socket);
  
  socket.on('message', function (data) {
    $('ul.messages').append('<li>' + data.message + '</li>');
  });
  
  $('form').on('submit', function (event) {
    event.preventDefault();
    var $input = $('#message_field');
    var message = $input.val();
    $input.val('');
    chat.sendMessage(message);
  });

});
