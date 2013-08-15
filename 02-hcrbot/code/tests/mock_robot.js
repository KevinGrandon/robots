/**
 * A mock robot interface for testing strategies, voice recognition, and more
 */

var mockBoard = {
	Component: function() {

	}
}

var HCRBot = require(__dirname + '/../robot.js').HCRBot
var robot = new HCRBot(mockBoard)

// Include robot libraries
var control = require(__dirname + '/../control.js')
control.init(robot)
robot.setControl(control)

var http = require(__dirname + '/../http_server.js').init(robot)

setTimeout(function() {
	robot.loopQueue = []
	robot.init()
}, 2000)