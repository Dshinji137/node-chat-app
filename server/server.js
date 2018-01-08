const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const port = process.env.PORT || 4000;
const publicPath = path.join(__dirname,'../public');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket) => {
  console.log('new user connected');

  socket.on('createMessage',function(message) {
    console.log('New message from client',message);
    io.emit('newMessage',{
      from: message.from,
      text: message.text,
      createdAt: new Date().getTime()
    });

  })

  socket.on('disconnect',() => {
    console.log('Disconnected from client');
  });
})

server.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
