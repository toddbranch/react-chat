var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var messages = [
  {name: 'Jim', content: '@Dwight, what kind of bear is best?', room: 'Sales'},
  {name: 'Dwight', content: '@Jim stupid question.', room: 'Sales'},
  {name: 'Jim', content: '@Dwight false.  The answer is Black Bear.  Fact: bears eat beats.  Bears.  Beets.  Battlestar Gallactica.', room: 'Sales'},
  {name: 'Dwight', content: '@Michael!', room: 'Sales'},
  {name: 'Michael', content: 'Happy Birthday Jesus. Sorry your party sucked.', room: 'Party Planning'},
  {name: 'Angela', content: 'Stop it @Michael!', room: 'Party Planning'},
  {name: 'Phyllis', content: 'We\'re doing the best we can, @Michael.', room: 'Party Planning'},
];

app.use(express.static('.'));

io.on('connection', function(socket) {
  socket.emit('messages', messages);
  socket.on('message', function(message) {
    messages.unshift(message);
    io.emit('messages', [message]);
  });
});

http.listen(3000, function() {
  console.log('listening on 3000');
});
