exports.runQueue = function(queue) {

	console.log('Configuring queue!')

	var pinio = new (require('pinio')).Pinio()

	pinio.on('ready', function(board) {

		var HCRBot = require(__dirname + '/../robot.js').HCRBot
		var robot = new HCRBot(board)

		// Include robot libraries
		var control = require(__dirname + '/../control.js')
		control.init(robot)
		robot.setControl(control)

		setTimeout(function() {
			robot.loopQueue = queue
			robot.init()
		}, 2000)
	})

}