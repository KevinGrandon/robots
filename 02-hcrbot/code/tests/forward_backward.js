
/**
 * This test runs the robot forward and backwards
 */

var testRunner = require(__dirname + '/test_runner.js')

var myQueue = [
	{
		control: 'forward',
		time: 2000
	},
	{
		control: 'gentleStop',
		time: 200
	},
	{
		control: 'stop',
		time: 1000
	},
	{
		control: 'backward',
		time: 2000
	},
	{
		control: 'gentleStop',
		time: 200
	},
	{
		control: 'stop',
		time: 1000
	}]

// Run it three times
myQueue = myQueue.concat(myQueue).concat(myQueue)

testRunner.runQueue(myQueue)
