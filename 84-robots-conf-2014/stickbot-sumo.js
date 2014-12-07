var ds = require('dualshock-controller')()
var five = require("johnny-five"),
  board, led;

board = new five.Board();

board.on("ready", function() {

	console.log('board ready.')

	var attackArmMinStart = 0;
	var attackArmMaxStart = 180;

	var attackArmLeftEnd = 90;
	var attackArmRightEnd = 90;

	var servos = {
		leftWheel: new five.Servo({
			pin: 3,
			//type: "continuous"
		}),
		rightWheel: new five.Servo({
			pin: 5,
			//type: "continuous"
		}),
		leftArm: new five.Servo(10),
		rightArm: new five.Servo(6)
	}

	for (var i in servos) {
		var obj = {};
		obj[i] = servos[i];
		board.repl.inject(obj);
	}

	servos.leftArm.to(attackArmMaxStart);
	servos.rightArm.to(attackArmMinStart);

	servos.leftWheel.to(90);
	servos.rightWheel.to(90);

	var minBound = 120
	var maxBound = 135

	var lastWrites = {};

	function servoWrite(servo, value) {
		if (lastWrites[servo] !== undefined && lastWrites[servo] === value) {
			return;
		}
		console.log('Writing ', value, ' to ', servo)
		servos[servo].to(value);
		lastWrites[servo] = value;
	}

	/**
	 * Rotates a servo either 'cw' or 'ccw'.
	 */
	function continuousWrite(servo, dir) {
		if (lastWrites[servo] !== undefined && lastWrites[servo] === dir) {
			return;
		}

		servos[servo].to(dir);
		lastWrites[servo] = dir;
	}

	ds.on('l1:press', function(data) {
		console.log('l1 press', data)
		servoWrite('leftArm', attackArmMaxStart);
		servoWrite('rightArm', attackArmMinStart);
	})

	ds.on('r1:press', function(data) {
		console.log('r1 press', data)
		servoWrite('leftArm', attackArmLeftEnd);
		servoWrite('rightArm', attackArmRightEnd);
	})

	ds.on('triangle:press', function(data) {
		console.log('triangle press', data)
		servoWrite('leftArm', 0);
		servoWrite('rightArm', 180);
	})

	ds.on('left:move', function(data) {
		if (data.y < maxBound && data.y > minBound) {
			console.log('Left -> Stop', data.y)
			continuousWrite('leftWheel', 90);
		} else if (data.y < maxBound) {
			console.log('Left -> Forward', data.y)
			continuousWrite('leftWheel', 180);
		} else if (data.y > minBound) {
			console.log('Left -> Backward', data.y)
			continuousWrite('leftWheel', 0);
		}	
	})

	ds.on('right:move', function(data) {
		if (data.y < maxBound && data.y > minBound) {
			console.log('Right -> Stop', data.y)
			continuousWrite('rightWheel', 90);
		} else if (data.y < maxBound) {
			console.log('Right -> Forward', data.y)
			continuousWrite('rightWheel', 0);
		} else if (data.y > minBound) {
			console.log('Right -> Backward', data.y)
			continuousWrite('rightWheel', 180);
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
