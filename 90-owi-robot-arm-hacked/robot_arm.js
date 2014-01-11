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
	var leapDiff = maxBound - minBound
	var motorDiff = motor.max - motor.min
	var per = reading/leapDiff
	var result = per * motorDiff + motor.min

	if (result > motor.max) result = motor.max
	if (result < motor.min) result = motor.min

	return result
}

pinio.on('ready', function(board) {
	var motors = require('./motorconfig').getMotors(board)

	// Wait for potentiometers to read before moving
	setTimeout(init, 2000)

	var fingerDistance = 0

	function init() {
		leapSocket.on('message', function(data, flags) {
			data = JSON.parse(data)

			// Populate finger data
			if (data.pointables && data.pointables.length === 2) {
				var distance = data.pointables[1].tipPosition[0] - data.pointables[0].tipPosition[0]
				fingerDistance = distance
			}
		})

		setInterval(function() {
			// Leap bounds: -30 and -100
			var fingers = motors[4]
			fingers.moveTo(normalize(fingers, fingerDistance, -30, -100))
		}, 1000)
	}

})
