var pinio = new (require('pinio')).Pinio()
var Leap = require('leapjs');

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

	var baseYawThreshold = 5;
	var handYaw = null;
	var lastHandYaw = null;

	function init() {
		Leap.loop(function(frame){
			// Populate finger frame
		    if (frame.pointables && frame.pointables.length >= 2) {
		      var distance = frame.pointables[1].tipPosition[0] - frame.pointables[0].tipPosition[0];
		      fingerDistance = distance;
		    } else {
		    	fingerDistance = 25;
		    }

		    if (frame.hands && frame.hands[0]) {
		    	handYaw = frame.hands[0].yaw();
		    } else {
		    	// If no hand use default.
		    	handYaw = 0;
		    }
		})

		setInterval(function() {

			// Update base position based on hand yaw.
			if (handYaw && Math.abs(lastHandYaw - handYaw) > 0.1) {
				var baseMotor = motors[0];
				var moveBaseToPosition = normalize(baseMotor, handYaw, -1, 1);
				baseMotor.moveTo(moveBaseToPosition);
				lastHandYaw = handYaw;
			}

			// Check that we have met some minimum threshold of movement so we don't keep
			// updating the motors if not needed.
			if (fingerDistance && Math.abs(lastFingerDistance - fingerDistance) > fingerThreshold) {
				var fingerMotor = motors[4]
				// Invert the scale for the fingers.
				var moveTo = normalize(fingerMotor, fingerDistance, 40, 10);
				fingerMotor.moveTo(moveTo);
				lastFingerDistance = fingerDistance;
			}
		}, 1000)
	}

})
