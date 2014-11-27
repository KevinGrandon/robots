var pinio = new (require('pinio')).Pinio()
var webSocket = require('ws')
var leapSocket = new webSocket('ws://127.0.0.1:6437')

/**
 * Normalizes leap motion data for a specific motor.
 * @param {Object} motor object.
 * @param {Integer} reading of leap motion value.
 * @param {Integer} minBound. We scale this against the motor minimum bound.
 * @param {Integer} maxBound. We scale this against the motor maximum bound.
 */
function normalize(motor, reading, minBound, maxBound) {
	var result = motor.min + (reading - minBound) * (motor.max - motor.min) / (maxBound - minBound);

	if (result > motor.max) result = motor.max
	if (result < motor.min) result = motor.min

	return result
}

pinio.on('ready', function(board) {
	var motors = require('./motorconfig').getMotors(board)

	// Wait for potentiometers to read before moving
	setTimeout(init, 2000)

	var fingerThreshold = 5;
	var fingerDistance = null;
	var lastFingerDistance = null;

	function init() {
		leapSocket.on('message', function(data, flags) {
			data = JSON.parse(data)

			// Populate finger data
		    if (data.pointables && data.pointables.length >= 2) {
		      var distance = data.pointables[1].tipPosition[0] - data.pointables[0].tipPosition[0];
		      fingerDistance = distance;
		    }
		})

		setInterval(function() {
			// Check that we have met some minimum threshold of movement so we don't keep
			// updating the motors if not needed.
			if (!fingerDistance || Math.abs(lastFingerDistance - fingerDistance) < fingerThreshold) {
				return;
			}

			var fingerMotor = motors[4]
			// Invert the scale for the fingers.
			var moveTo = normalize(fingerMotor, fingerDistance, 70, 20);
			console.log('Moving fingers to:', moveTo);
			fingerMotor.moveTo(moveTo);
			lastFingerDistance = fingerDistance;
		}, 1000)
	}

})
