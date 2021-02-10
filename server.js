const express = require("express");
const app = express();
const http = require("http").createServer(app);

const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("User joined");
  
  socket.emit("welcome", {"a":"asd","b":"qwe"});
});



var server_port = 5000;

http.listen(server_port, () => {
  console.log("started");
});
