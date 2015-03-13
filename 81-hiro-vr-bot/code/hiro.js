var pinio = new (require('pinio')).Pinio()

pinio.on('ready', function(board) {

	var robot = {
		board: board,

		speedLeft: 0,
		speedRight: 0,

		speed: 200 // Max is 255? Limit to avoid craziness for now.
	};

	var control = require(__dirname + '/control.js')
	control.init(robot)

	// Go forward and stop.
	control.forward(robot);
	setTimeout(function() {
		control.stop(robot)
	}, 5000)
})
