var http = require("http");
var static = require("node-static");
var socketio = require("socket.io");
var chatServer = require("./chat_server");

var file = new static.Server("./public");

var server = http.createServer(function(req, res) {
  req.addListener("end", function() {
    file.serve(req, res);
  }).resume();
});

chatServer(server);

server.listen(8000);