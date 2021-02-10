const io_c = require("socket.io-client");

let socket_c = io_c.connect("http://localhost:5000");

socket_c.on("welcome", (data) => { 
    console.log("recieved:", data);
});


