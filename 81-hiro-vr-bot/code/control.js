var motor1Speed, motor2Speed, motor1Dir, motor2Dir
var lastMotor1Dir, lastMotor2Dir;

// Local robot spec reference.
var robot;

exports.init = function(_robot) {

	robot = _robot;

	motor1Speed = new robot.board.Component({
		pin: 5
	})

	motor2Speed = new robot.board.Component({
		pin: 6
	})

	motor1Dir = new robot.board.Component({
		pin: 4
	})

	motor2Dir = new robot.board.Component({
		pin: 7
	})
}

/**
 * Enables PWM for the pin if needed.
 * We store the state of the pwm pin in _pwnEnabled.
 * This is false after a stop command.
 */
var _pwnEnabled = false
function enablePWMIfNeeded() {
	if (_pwnEnabled) {
		return
	}

	motor1Speed.mode('PWM')
	motor2Speed.mode('PWM')
	_pwnEnabled = true
}

/**
 * Ramps the speed of a robot up over 500ms
 */
var rampSpeedNext
function rampSpeed(left, right) {

	var nextLeft, nextRight
	var step = 10

	// Increment left
	if (left < robot.speedLeft)
		robot.speedLeft -= step
	if (left > robot.speedLeft)
		robot.speedLeft += step

	// Increment right
	if (right < robot.speedRight)
		robot.speedRight -= step
	if (right > robot.speedRight)
		robot.speedRight += step

	// Handle threshold floor
	// Jump to either threshold or negative threshold
	// This is to prevent values where nothing would happen
	
	var threshold = 50
	if (robot.speedLeft > 0 && robot.speedLeft < threshold && left != 0)
		robot.speedLeft = threshold
	else if (robot.speedLeft < 0 && robot.speedLeft > -threshold && left != 0)
		robot.speedLeft = -threshold

	if (robot.speedRight > 0 && robot.speedRight < threshold && right != 0)
		robot.speedRight = threshold
	else if (robot.speedRight < 0 && robot.speedRight > -threshold && right != 0)
		robot.speedRight = -threshold

	if (robot.speedLeft < threshold && robot.speedLeft > 0 && left <= 0)
		robot.speedLeft = 0
	else if (robot.speedLeft > -threshold && robot.speedLeft < 0 && left >= 0)
		robot.speedLeft = 0

	if (robot.speedRight < threshold && robot.speedRight > 0 && right <= 0)
		robot.speedRight = 0
	else if (robot.speedRight > -threshold && robot.speedRight < 0 && right >= 0)
		robot.speedRight = 0
	

	// Handle 255 limit
	if (robot.speedLeft > 255)
		robot.speedLeft = 255
	else if (robot.speedLeft < -255)
		robot.speedLeft = -255

	if (robot.speedRight > 255)
		robot.speedRight = 255
	else if (robot.speedRight < -255)
		robot.speedRight = -255

	// Write left motor direction
	if (robot.speedLeft > 0 && lastMotor1Dir !== 1) {
		lastMotor1Dir = 1;
		motor1Dir.high()
	} else if (robot.speedLeft < 0 && lastMotor1Dir !== 0) {
		lastMotor1Dir = 0;
		motor1Dir.low()
	}

	// Write right motor direction
	if (robot.speedRight > 0 && lastMotor2Dir !== 1) {
		lastMotor2Dir = 1
		motor2Dir.high()
	} else if (robot.speedRight < 0 && lastMotor2Dir !== 0) {
		lastMotor2Dir = 0
		motor2Dir.low()
	}

	motor1Speed.write(Math.abs(robot.speedLeft))
	motor2Speed.write(Math.abs(robot.speedRight))

	console.log('Writing speed: ', robot.speedLeft, robot.speedRight )

	// Set timeout if we actually have more steps
	if (left != robot.speedLeft || right != robot.speedRight) {
		console.log('Ramped speed to: ', robot.speedLeft, robot.speedRight)
		rampSpeedNext = setTimeout(rampSpeed.bind(this, left, right), 25)
	} else {
		console.log('Reached target speed.', robot.speedLeft, robot.speedRight)
	}

	// Disable motors if reached speed 0.
	if (robot.speedLeft === 0 && robot.speedRight === 0) {
		control.disable()
	}
}

var control = {
	/**
	 * Disables motors pins from being in pwm mode.
	 */
	disable: function(){
		console.log('Disabling motors.')

		clearTimeout(rampSpeedNext)

		motor1Speed.output()
		motor2Speed.output()

		_pwnEnabled = false

		motor1Speed.low()
		motor2Speed.low()
	},

	/**
	 * Similar to disable, but ramps down and decellerates the motor
	 */
	stop: function(){
		enablePWMIfNeeded()
		clearTimeout(rampSpeedNext)
		rampSpeed(0, 0)
	},

	forward: function(){
		enablePWMIfNeeded()
		clearTimeout(rampSpeedNext)
		rampSpeed(robot.speed, robot.speed)
	},

	backward: function(){
		enablePWMIfNeeded()
		clearTimeout(rampSpeedNext)
		rampSpeed(0-robot.turnSpeed, 0-robot.turnSpeed)
	},

	leftTurn: function(){
		enablePWMIfNeeded()
		clearTimeout(rampSpeedNext)
		rampSpeed(0-robot.turnSpeed, robot.turnSpeed)
	},

	rightTurn: function(){
		enablePWMIfNeeded()
		clearTimeout(rampSpeedNext)
		rampSpeed(robot.speed, 0-robot.speed)
	}
}

exports.stop = control.stop
exports.gentleStop = control.gentleStop
exports.forward = control.forward
exports.backward = control.backward
exports.leftTurn = control.leftTurn
exports.rightTurn = control.rightTurn

