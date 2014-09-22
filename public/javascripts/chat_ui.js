$(function () {
  var socket = io('http://localhost');
  var chat = new ChatNamespace.Chat(socket);
  
  socket.on('message', function (data) {
    $('ul.messages').append('<li>' + data.nickName + " > " + data.message + '</li>');
  });
  
  socket.on("nicknameChangeResult", function(data) {
    $('ul.messages').append('<li>' + data.nickName + " > " + data.message + '</li>');
  });
  
  socket.on("users", function(nickNames) {
    var $users = $("ul.users");
    $users.html("");
    for (var key in nickNames) {
      if (nickNames[key] !== "") {
        $users.append("<li>" + nickNames[key] + "</li>");
      }
    }
  });
  
  $('form').on('submit', function (event) {
    event.preventDefault();
    var $input = $('#message_field');
    var message = $input.val();
    if (message.substring(0, 1) === '/') {
      chat.parseCommands(message.substring(1));
    } else {
      chat.sendMessage(message);
    }
    $input.val('');
  });

});
