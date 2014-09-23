(function() {
  if (typeof ChatNamespace === "undefined") {
    var ChatNamespace = window.ChatNamespace = {};    
  }
  
  ChatNamespace.Chat = function(socket) {
    this.socket = socket;
  };
  
  ChatNamespace.Chat.prototype.sendMessage = function(message) {
    this.socket.emit('message', { message: message });
  };
  
  ChatNamespace.Chat.prototype.parseCommands = function(command) {
    var path = command.split(" ")[0];
    var attribute = command.split(" ")[1];
    switch(path) {
      case "nick":
        this.changeNickname(attribute);
        break;
      case 'join':
        this.changeRoom(attribute);
        break;
      default:
        this.socket.emit("unrecognizedCommand");
    }
  };
  
  ChatNamespace.Chat.prototype.changeNickname = function(name) {
    this.socket.emit("nicknameChangeRequest", name);
  };
  
  ChatNamespace.Chat.prototype.changeRoom = function (room) {
    this.socket.emit("handleRoomChangeRequests", room);
  };
  
}());

