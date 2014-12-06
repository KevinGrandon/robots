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

	var palmThreshold = 5;
	var palmHeight = null;
	var lastPalmHeight = null;

	function init() {
		Leap.loop(function(frame){
			// Populate finger info, for the claw fingers.
		    if (frame.pointables && frame.pointables.length >= 2) {
		      var distance = frame.pointables[1].tipPosition[0] - frame.pointables[0].tipPosition[0];
		      fingerDistance = distance;
		    } else {
		    	fingerDistance = 25;
		    }

		    // Set the yaw information for the arm base.
		    if (frame.hands && frame.hands[0]) {
		    	handYaw = frame.hands[0].yaw();
		    } else {
		    	// If no hand use default.
		    	handYaw = 0;
		    }

		    // Set y-axis info for the arm/shoulder joints.
			if (frame.hands && frame.hands[0]) {
		    	palmHeight = frame.hands[0].palmPosition[1];
		    } else {
		    	// If no hand use default.
		    	palmHeight = 200;
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
			console.log('fingerDistance', fingerDistance)
			if (fingerDistance && Math.abs(lastFingerDistance - fingerDistance) > fingerThreshold) {
				var fingerMotor = motors[4]
				// Invert the scale for the fingers.
				var moveTo = normalize(fingerMotor, fingerDistance, 40, 10);
				fingerMotor.moveTo(moveTo);
				lastFingerDistance = fingerDistance;
			}

			// Palm height. Moves shoulder/elbow joints.
			if (palmHeight && Math.abs(lastPalmHeight - palmHeight) > palmThreshold) {
				var shoulderMotor = motors[1];
				var elbowMotor = motors[2];

				var moveShoulderTo = normalize(shoulderMotor, palmHeight, 100, 300);
				var moveElbowTo = normalize(elbowMotor, palmHeight, 100, 300);
				console.log('shoulder/elbow moving:', moveShoulderTo, moveElbowTo)

				// Return for now.
				return;
				shoulderMotor.moveTo(moveShoulderTo);
				elbowMotor.moveTo(moveElbowTo);

				lastPalmHeight = palmHeight;
			}
		}, 1000)
	}

})
