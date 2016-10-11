var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var ent = require('ent'); // for security data
var mongoose    = require('mongoose');

var config = require('./app/config/config'); // get our config file
var usersCtrl = require('./app/controllers/users');
var alliancesCtrl = require('./app/controllers/alliances');

var rooms = ['all', 'alliance'] ;

mongoose.connect(config.database); // connect to database

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function (socket, pseudo) {

  // Disconnect Event
  socket.on('disconnect', function(){
    io.emit('disconnect', 'A user disconnected');
    console.log('A user disconnected');
    message = socket.pseudo + ' disconnected.' ;

    alliancesCtrl.findPromiseByUser(socket.pseudo)
    .then(function(alliance){
      if(alliance){
        console.log(socket.pseudo + 'joins alliance room ' + alliance.name);
        socket.join('alliance#' + alliance.name);
        socket.broadcast.to('alliance#' + alliance.name).emit('info', message);
      }
    })
    .catch(function(err){
      console.log(err);
    });
  });

  // Connect event
  socket.on('new_user', function(pseudo) {
    console.log('New client : ' + pseudo);
    pseudo = ent.encode(pseudo);
    socket.pseudo = pseudo;
    message = socket.pseudo + ' connected.' ;

    socket.join('all');

    alliancesCtrl.findPromiseByUser(socket.pseudo)
    .then(function(alliance){
      if(alliance){
        console.log(socket.pseudo + 'joins alliance room ' + alliance.name);
        socket.join('alliance#' + alliance.name);
        socket.broadcast.to('alliance#' + alliance.name).emit('info', message);
      }
    })
    .catch(function(err){
      console.log(err);
    });

    /*if(socket.pseudo !== 'alone'){
      socket.join('alliance');
      socket.broadcast.to('alliance').emit('info', message);
    }*/
  });

  // Message event
  socket.on('message', function (message) {
    console.log('New message : ' + message + ' from ' + socket.pseudo);
    message = ent.encode(message);
    socket.broadcast.to('all').emit('message', {pseudo: socket.pseudo, message: '[All] ' + message});
  });

  socket.on('alliance', function (message) {
    alliancesCtrl.findPromiseByUser(socket.pseudo)
    .then(function(alliance){
      if(alliance){
        console.log('New message : ' + message + ' from ' + socket.pseudo + ' to alliance ' + alliance.name);
        message = ent.encode(message);
        socket.broadcast.to('alliance#' + alliance.name).emit('message', {pseudo: socket.pseudo, message: '[Alliance] ' + message});
      }
    })
    .catch(function(err){
      console.log(err);
    });


  }); 



});

http.listen(3000, function(){
  console.log('listening on *:3000');
});