
function createChat (server) {
  var guestNumber = 0;
  var nickNames = {};
  var currentRooms = {};
  // var roomUsers = {};
  var io = require('socket.io')(server);
  
  var sendUsers = function(socket) {
    var userRooms = {};
    for (var key in currentRooms) {
      userRooms[nickNames[key]] = currentRooms[key];
    }
    io.emit("users", userRooms);
  };
  
  var sendDepartureMessage = function (socket, oldRoom){
    io.to(oldRoom).emit('message', {
      message: nickNames[socket.id] + " has left " + oldRoom,
      nickName: "Server Message"
    });
  };
  
  var joinRoom = function (socket, room) {
    if (typeof currentRooms[socket.id] !== "undefined") {
      socket.leave(currentRooms[socket.id]);
    }
    
    sendDepartureMessage(socket, currentRooms[socket.id]);
    socket.join(room);
    
    // var currentRoom = currentRooms[socket.id];
//     if (typeof currentRoom !== "undefined") {
//       var username = nickNames[socket.id];
//       var userIndex = roomUsers[currentRoom].indexOf(username);
//       delete roomUsers[userIndex];
//     }
//
//     if (typeof roomUsers[room] === "undefined") {
//       roomUsers[room] = [];
//     }
    // roomUsers[room].push(nickNames[socket.id]);
    
    currentRooms[socket.id] = room;
    sendUsers(socket);
  };
  
  io.on('connection', function (socket) {
    nickNames[socket.id] = "guest" + guestNumber;
    guestNumber++;
    
    joinRoom(socket, 'lobby');
    
    io.to(currentRooms[socket.id]).emit('message', {
      message: nickNames[socket.id] + " has connected",
      nickName: "Server Message"
    });
    
    sendUsers(socket);
    
    socket.on('message', function (data) {
      data.nickName = nickNames[socket.id];
      io.to(currentRooms[socket.id]).emit('message', data);
    });
    
    socket.on('handleRoomChangeRequests', function (room){
      joinRoom(socket, room);
      io.to(room).emit('message', {
        message: nickNames[socket.id] + " has joined " + room,
        nickName: "Server Message"
      });
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
          socket.to(currentRooms[socket.id]).emit("nicknameChangeResult", {
            success: false,
            nickName: "Server Message",
            message: "Name already taken"
          });
          return;
        }
      }
      
      nickNames[socket.id] = nickName;
      io.to(currentRooms[socket.id]).emit("nicknameChangeResult", {
        success: true,
        nickName: "Server Message",
        message: oldName + " changed name to " + nickName
      });
      
      sendUsers(socket);
    });
    
    socket.on('disconnect', function () {
      io.to(currentRooms[socket.id]).emit('message', {
        message: nickNames[socket.id] + " left chat",
        nickName: "Server Message"
      });
      
      // remove user from room
      delete nickNames[socket.id];
      sendUsers(socket);
    });
  });
}



module.exports = createChat;