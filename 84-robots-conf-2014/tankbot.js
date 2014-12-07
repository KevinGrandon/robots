var ds = require('dualshock-controller')()
var five = require("johnny-five"),
  board, led;

board = new five.Board();

console.log('Connecting..');
board.on("ready", function() {

	console.log('board ready.')

	var motors = {
		leftWheel: new five.Motor({
			pins: {
				pwm: 10,
				dir: 8
			}
		}),
		rightWheel: new five.Motor({
			pins: {
				pwm: 9,
				dir: 7
			}
		})
	}

	for (var i in motors) {
		var obj = {};
		obj[i] = motors[i];
		board.repl.inject(obj);
	}

	var minBound = 120
	var maxBound = 135

	motors.leftWheel.stop();
	motors.rightWheel.stop();

	var lastWrites = {};

	function motorWrite(motor, method) {
		if (lastWrites[motor] !== undefined && lastWrites[motor] === method) {
			return;
		}
		console.log('Writing ', method, ' to ', motor)

		motors[motor][method]();
		lastWrites[motor] = method;
	}

	ds.on('left:move', function(data) {
		if (data.y < maxBound && data.y > minBound) {
			console.log('Left -> Stop', data.y)
			motorWrite('leftWheel', 'stop');
		} else if (data.y < maxBound) {
			console.log('Left -> Forward', data.y)
			motorWrite('leftWheel', 'reverse');
		} else if (data.y > minBound) {
			console.log('Left -> Backward', data.y)
			motorWrite('leftWheel', 'forward');
		}	
	})

	ds.on('right:move', function(data) {
		if (data.y < maxBound && data.y > minBound) {
			console.log('Right -> Stop', data.y)
			motorWrite('rightWheel', 'stop');
		} else if (data.y < maxBound) {
			console.log('Right -> Forward', data.y)
			motorWrite('rightWheel', 'reverse');
		} else if (data.y > minBound) {
			console.log('Right -> Backward', data.y)
			motorWrite('rightWheel', 'forward');
		}
	})


	ds.on('connected', function(data) {
		console.log('ds connected');
	})

	ds.on('error', function (data) {
		console.log(data)
	})

	console.log('connecting.')
	ds.connect()


});
