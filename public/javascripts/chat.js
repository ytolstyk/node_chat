(function() {
  if (typeof ChatNamespace === "undefined") {
    var ChatNamespace = window.ChatNamespace = {};    
  }
  
  ChatNamespace.Chat = function(socket) {
    this.socket = socket;
  };
  
  ChatNamespace.Chat.prototype.sendMessage = function(message) {
    this.socket.emit('message', {message: message });
  };
  
}());

