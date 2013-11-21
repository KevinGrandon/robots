/**
 * This test is to detect lowest supported PWM from 255 -> 0
 * WARNING: If you set the LONG var to true,
 * This test expects the robot to be proped up as it's extremely long
 */

var testRunner = require(__dirname + '/test_runner.js')

var current = 255

function getNext(val) {
	return function(robot) {
		console.log('Testing PWM: ', val)
		robot.speed = val

		robot.control.forward(robot)

		// Set time of this commend
		return 1000
	}
}

var myQueue = []
for (var i = current; i >= 100; i -= 10) {
	myQueue.push(getNext(i))
}
myQueue.push(function(robot) {
	robot.control.stop(robot)
	setTimeout(function() {
		throw new Error('Exit!')
	})
	return 10000
})

testRunner.runQueue(myQueue)
