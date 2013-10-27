// const DESTINATION = 'http://localhost:3000';
const DESTINATION = 'http://aegis-server.herokuapp.com';

var express = require('express');
var routes = require('./routes/main.js');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var io = require('socket.io-client');

var app = express();

app.set('port', process.env.PORT || 4000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//----------------------------------------------------------------------//

app.get('/', routes.index);

var server = http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
//var io = require('socket.io-client').listen(server);
//var io = require('socket.io-client');

// Recieve
var socket = io.connect(DESTINATION);
socket.on('connect', function() {
    console.log('Connect to Server: ' + DESTINATION);

    socket.on('update', function(value) {
        console.log(DESTINATION + ': ' + value);
    });
});
