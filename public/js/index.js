var socket = io();

socket.on('connect', function() {
  console.log('Connected to server');

  socket.emit('createMessage',{
    from: 'Client',
    text: 'New message test',
  });

});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('newMessage', function(message) {
  console.log('New message from server');
  console.log(message);
});
