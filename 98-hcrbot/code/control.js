var motor1Speed, motor2Speed, motor1Dir, motor2Dir

exports.init = function(robot) {

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
 * Ramps the speed of a robot up over 500ms
 */
var rampSpeedNext
function rampSpeed(robot, left, right) {

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

	// Write left speed to motor and direction
	motor1Speed.write(Math.abs(robot.speedLeft))
	if (robot.speedLeft > 0)
		motor1Dir.high()
	else
		motor1Dir.low()

	// Write right speed to motor and direction
	motor2Speed.write(Math.abs(robot.speedRight))
	if (robot.speedRight > 0)
		motor2Dir.high()
	else
		motor2Dir.low()


	//console.log('Writing speed: ', robot.speedLeft, robot.speedRight )

	// Set timeout if we actually have more steps
	if (left != robot.speedLeft || right != robot.speedRight)
		rampSpeedNext = setTimeout(rampSpeed.bind(this, robot, left, right), 25)
	else
		console.log('Reached target speed.')
}

var control = {
	stop: function(){

		clearTimeout(rampSpeedNext)

		motor1Speed.output()
		motor2Speed.output()

		motor1Speed.low()
		motor2Speed.low()
	},

	/**
	 * Similar to stop, but ramps down and decellerates the motor
	 */
	gentleStop: function(robot){

		motor1Speed.mode('PWM')
		motor2Speed.mode('PWM')

		clearTimeout(rampSpeedNext)
		rampSpeed(robot, 0, 0)
	},

	forward: function(robot){

		motor1Speed.mode('PWM')
		motor2Speed.mode('PWM')

		clearTimeout(rampSpeedNext)
		rampSpeed(robot, robot.speed, robot.speed)
	},

	backward: function(robot){

		motor1Speed.mode('PWM')
		motor2Speed.mode('PWM')

		clearTimeout(rampSpeedNext)
		rampSpeed(robot, 0-robot.speed, 0-robot.speed)
	},

	leftTurn: function(robot){

		motor1Speed.mode('PWM')
		motor2Speed.mode('PWM')

		clearTimeout(rampSpeedNext)
		rampSpeed(robot, 0-robot.speed, robot.speed)
	},

	rightTurn: function(robot){

		motor1Speed.mode('PWM')
		motor2Speed.mode('PWM')

		clearTimeout(rampSpeedNext)
		rampSpeed(robot, robot.speed, 0-robot.speed)
	},

	resetLoopQueue: function(robot) {
		robot.loopQueue = robot.defaultQueue
	}
}

exports.stop = control.stop
exports.gentleStop = control.gentleStop
exports.forward = control.forward
exports.backward = control.backward
exports.leftTurn = control.leftTurn
exports.rightTurn = control.rightTurn
exports.resetLoopQueue = control.resetLoopQueue
