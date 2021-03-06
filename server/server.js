const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const port = process.env.PORT || 4000;
const publicPath = path.join(__dirname,'../public');
const { Users } = require('./utils/users');
const { generateMessage, generateLocationMessage } = require('./utils/message');
const { isRealString } = require('./utils/validation');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection',(socket) => {
  console.log('new user connected');

  socket.on('join',(params,callback) => {
    if(!isRealString(params.name) || !isRealString(params.room)) {
      callback('Name and Room name are required');
    }

    socket.join(params.room);
    users.removeUser(socket.id);
    users.addUser(socket.id,params.name,params.room);

    io.to(params.room).emit('updateUserList',users.getUserList(params.room));

    socket.emit('newMessage',generateMessage('Admin','Welcome to chat app'));
    socket.broadcast.to(params.room).emit('newMessage',generateMessage('Admin',`${params.name} has joined`));

    callback();
  })

  socket.on('createMessage',function(message,callback) {
    //console.log('New message from client',message);
    var user = users.getUser(socket.id);

    if(user.length>0 && isRealString(message.text)) {
      io.to(user[0].room).emit('newMessage', generateMessage(user[0].name,message.text));
    }

    callback();
  });

  socket.on('createLocationMessage',(coords) => {
    var user = users.getUser(socket.id);

    if(user.length>0) {
      io.to(user[0].room).emit('newLocationMessage',generateLocationMessage(user[0].name,coords.lat,coords.lng));
    }
  })

  socket.on('disconnect',() => {
    var user = users.removeUser(socket.id);
    if(user.length>0) {
      io.to(user[0].room).emit('updateUserList',users.getUserList(user[0].room));
      io.to(user[0].room).emit('newMessage',generateMessage('Admin',`${user[0].name} has left`));
    }
    console.log('Disconnected from client');
  });
})

server.listen(port, () => {
  console.log(`Started up at port ${port}`);
});
