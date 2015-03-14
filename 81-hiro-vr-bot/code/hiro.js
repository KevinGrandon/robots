var pinio = new (require('pinio')).Pinio()

var control;

pinio.on('ready', function(board) {

	var robot = {
		board: board,

		speedLeft: 0,
		speedRight: 0,

		speed: 255, // Max is 255? Limit to avoid craziness for now.
		turnSpeed: 175,

		handleBumper: function(data) {
			console.log('Got bumper', data.pos, data.pin)
			io.sockets.emit('bumper', data)
		}
	};

	bumpers = require(__dirname + '/bumpers.js')
	bumpers.init(robot)

	control = require(__dirname + '/control.js')
	control.init(robot)
})

// Webserver.
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/www'));

io.on('connection', function (socket) {
	console.log('got connection');

	socket.on('start', function (data) {
		console.log('data is:', data);
		var key = data.command;
		var commandMap = {
			up: 'forward',
			right: 'rightTurn',
			down: 'backward',
			left: 'leftTurn'
		};

		var robotMethod = commandMap[key]
		if (!robotMethod) {
			console.log('No command found for ', key)
			return
		}

		if (!control) {
			console.log('Robot not initialized yet')
			return
		}

		control[robotMethod]()
	})

	socket.on('stop', function (data) {
		if (!control) {
			console.log('Robot not initialized yet')
			return
		}

		control.stop()
	});
});

server.listen(port, function () {
	console.log('Server listening at port %d', port)
})
