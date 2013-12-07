/**
 * Dualspark is a sumobot built with a Sparkcore, and PS3 dualshock controller.
 */

var ds = require('dualshock-controller')()
var Sparky = require('sparky')
var config = require('./config')

var sparky = new Sparky({
	deviceId: config.DEVICE_ID,
	token: config.ACCESS_TOKEN
})

var minBound = 120
var maxBound = 135
var throttleTime = 500

ds.on('left:move', function(data) {
	if (data.y < maxBound && data.y > minBound) {
		console.log('Left -> Stop')
		sparky.throttle(throttleTime).analogWrite('A1', 90);
	} else if (data.y > maxBound) {
		console.log('Left -> Forward')
		sparky.throttle(throttleTime).analogWrite('A1', 180);
	} else if (data.y < minBound) {
		console.log('Left -> Backward')
		sparky.throttle(throttleTime).analogWrite('A1', 0);
	}
})

ds.on('right:move', function(data) {
	if (data.x < maxBound && data.x > minBound) {
		console.log('Right -> Stop')
		sparky.throttle(throttleTime).analogWrite('A0', 90);
	} else if (data.x > maxBound) {
		console.log('Right -> Forward')
		sparky.throttle(throttleTime).analogWrite('A0', 180);
	} else if (data.x < minBound) {
		console.log('Right -> Backward')
		sparky.throttle(throttleTime).analogWrite('A0', 0);
	}
})

ds.on('connected', function(data) {
	console.log('ds connected');
})

ds.on('error', function (data) {
	console.log(data)
})

ds.connect()
