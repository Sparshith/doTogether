var app = require('express')();
var express = require('express');
var http = require('http').createServer(app);
var io = require('socket.io')(http);


app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/rooms/:roomId', function(req, res) {
  res.sendFile(__dirname + '/room.html');
});



io.on('connection', (socket) => {
  socket.on('room', function(room) {
  	console.log("user connected to room " + room)
    socket.join(room);
  });

  socket.on('timerEvent', (eventType) => {
    room = Object.keys(socket.rooms)[1];
    io.sockets.to(room).emit('timerEvent', eventType);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

});

http.listen(3000, () => {
  console.log('listening on *:3000');
});


