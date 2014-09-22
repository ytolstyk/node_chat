
function createChat (server) {
  var guestNumber = 0;
  var nickNames = {};
  var io = require('socket.io')(server);
  io.on('connection', function (socket) {
    nickNames[socket.id] = "guest" + guestNumber;
    guestNumber++;
    
    io.emit('message', {
      message: nickNames[socket.id] + " has connected",
      nickName: "Server Message"
    });
    
    socket.on('message', function (data) {
      data.nickName = nickNames[socket.id];
      io.emit('message', data);
    });
    
    socket.on("unrecognizedCommand", function () {
      var data = {};
      data.nickName = "Server Message";
      data.message = "unrecognized command";
      socket.emit("message", data);
    });
    
    socket.on("nicknameChangeRequest", function (nickName) {
      var oldName = nickNames[socket.id];
      for (var key in nickNames) {
        if (nickName === nickNames[key]) {
          socket.emit("nicknameChangeResult", {
            success: false,
            nickName: "Server Message",
            message: "Name already taken"
          });
          return;
        }
      }
      
      nickNames[socket.id] = nickName;
      io.emit("nicknameChangeResult", {
        success: true,
        nickName: "Server Message",
        message: oldName + " changed name to " + nickName
      });
    });
    
    socket.on('disconnect', function () {
      io.emit('message', {
        message: nickNames[socket.id] + " left chat",
        nickName: "Server Message"
      });
      
      nickNames[socket.id] = '';
    });
  });
}

module.exports = createChat;