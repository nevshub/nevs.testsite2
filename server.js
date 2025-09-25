const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');

app.use(express.static(__dirname));

io.on('connection', socket => {
  console.log('a user connected');

  socket.on('signal', data => {
    io.emit('signal', data);
  });
});

http.listen(3000, () => console.log('Server running on http://localhost:3000'));
