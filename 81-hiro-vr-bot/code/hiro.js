var pinio = new (require('pinio')).Pinio()

var fs = require('fs')
var spawn = require('child_process').spawn;
var proc;

// Robot control class.
var control;

// Socket.io mapping.
var sockets = {};

// Robot control
pinio.on('ready', function(board) {
	var robot = {
		board: board,

		speedLeft: 0,
		speedRight: 0,

		speed: 255, // Max is 255? Limit to avoid craziness for now.
		turnSpeed: 175,

		handleBumper: function(data, pressed) {
			console.log('Got bumper', data.pos, data.pin)
			io.sockets.emit('bumper:' + (pressed ? 'down' : 'up'), data)

			// Stop the robot immediately on bumper hit
			control.disable()
		}
	};

	bumpers = require(__dirname + '/bumpers.js')
	bumpers.init(robot)

	control = require(__dirname + '/control.js')
	control.init(robot)
})

// RPi Streaming
function stopStreaming() {
  if (Object.keys(sockets).length == 0) {
    app.set('watchingFile', false)
    if (proc) proc.kill()
    fs.unwatchFile(__dirname + '/www/image_stream.jpg')
  }
}

function startStreaming(io) {
  if (app.get('watchingFile')) {
    io.sockets.emit('stream:data', 'image_stream.jpg?_t=' + (Math.random() * 100000))
    return
  }

  // Try to get to 25 fps
  var cameraTick = 40;
  var args = ["-w", "640", "-h", "480", "-o", __dirname + "/www/image_stream.jpg", "-t", "999999999", "-tl", String(cameraTick)]
  proc = spawn('raspistill', args)
  console.log('Watching for changes...')

  app.set('watchingFile', true)

  fs.watchFile(__dirname + '/www/image_stream.jpg', {persistent: true, interval: cameraTick}, function(current, previous) {
	io.sockets.emit('stream:data', 'image_stream.jpg?_t=' + (Math.random() * 100000))
  })
}


// Webserver.
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

app.use(express.static(__dirname + '/www'));

io.on('connection', function (socket) {
	console.log('got connection');
	sockets[socket.id] = socket;

	socket.on('disconnect', function() {
		delete sockets[socket.id]

		// no more sockets, kill the stream
		if (Object.keys(sockets).length == 0) {
			app.set('watchingFile', false)
			if (proc) proc.kill()
			fs.unwatchFile(__dirname + '/www/image_stream.jpg')
		}
	});

	socket.on('stream:start', function() {
		startStreaming(io);
	});

	// Gamepad API
	socket.on('gamepad:tankcontrol:move', function (data) {
		if (!control) {
			console.log('Robot not initialized yet')
			return
		}
		console.log('gamepad move', data)

		control.tankControl(data.left, data.right)
	})
	
	socket.on('gamepad:tankcontrol:stop', function (data) {
		if (!control) {
			console.log('Robot not initialized yet')
			return
		}
		console.log('gamepad stop')
		control.stop()
	})

	// Keyboard controls
	socket.on('keybarod:singlekeydown', function (data) {
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

	socket.on('keybarod:singlekeyup', function (data) {
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
