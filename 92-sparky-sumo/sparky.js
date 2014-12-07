var ds = require('dualshock-controller')()
var Spark = require("spark-io");
var config = require('./config')

var board = new Spark({
	token: config.ACCESS_TOKEN,
	deviceId: config.DEVICE_ID
});

var ctx;

console.log('connecting...', config.ACCESS_TOKEN, config.DEVICE_ID);
board.on("ready", function() {
	console.log('!!!!!!!!!!!!!!');
	console.log('board is ready');
	console.log('!!!!!!!!!!!!!!');
	ctx = this;

	ctx.pinMode('A0', this.MODES.SERVO);
	ctx.pinMode('A1', this.MODES.SERVO);

	ctx.pinMode('A4', this.MODES.SERVO);
	ctx.pinMode('A5', this.MODES.SERVO);

	ctx.servoWrite('A4', 90);
	ctx.servoWrite('A5', 90);
});

var minBound = 120
var maxBound = 135

var lastWrites = {};

function servoWrite(pin, value) {
	if (lastWrites[pin] !== undefined && lastWrites[pin] === value) {
		return;
	}
	ctx.servoWrite(pin, value);
	lastWrites[pin] = value;
}

var attackArmMin = 0;
var attackArmMax = 180;

ds.on('l1:press', function(data) {
	if (!ctx) { return; }

	console.log('l1 press', data)
	servoWrite('A4', attackArmMax);
	servoWrite('A5', attackArmMin);
})

ds.on('r1:press', function(data) {
	if (!ctx) { return; }

	console.log('r1 press', data)
	servoWrite('A4', attackArmMin);
	servoWrite('A5', attackArmMax);
})

ds.on('left:move', function(data) {
	if (!ctx) { return; }

	if (data.y < maxBound && data.y > minBound) {
		console.log('Left -> Stop', data.y)
		servoWrite('A0', 90);
	} else if (data.y < maxBound) {
		console.log('Left -> Forward', data.y)
		servoWrite('A0', 180);
	} else if (data.y > minBound) {
		console.log('Left -> Backward', data.y)
		servoWrite('A0', 0);
	}	
})

ds.on('right:move', function(data) {
	if (!ctx) { return; }

	if (data.y < maxBound && data.y > minBound) {
		console.log('Right -> Stop', data.y)
		servoWrite('A1', 90);
	} else if (data.y < maxBound) {
		console.log('Right -> Forward', data.y)
		servoWrite('A1', 0);
	} else if (data.y > minBound) {
		console.log('Right -> Backward', data.y)
		servoWrite('A1', 180);
	}
})

ds.on('connected', function(data) {
	console.log('ds connected');
})

ds.on('error', function (data) {
	console.log(data)
})

ds.connect()
