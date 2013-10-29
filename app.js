const PORT = 4000;
// const DESTINATION = 'http://localhost:3000'; 
//const DESTINATION = 'http://aegis-server.herokuapp.com:3000'; 

var express = require('express');
var routes = require('./routes/main.js');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
//var io = require('socket.io-client');

var app = express();

app.set('port', process.env.PORT || PORT);
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

var server = http.createServer(app);
var socketio = require('socket.io');
var io = socketio.listen(server);
server.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + app.get('port'));
});

