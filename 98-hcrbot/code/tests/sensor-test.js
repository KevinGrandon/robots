
var pinio = new (require('pinio')).Pinio()

pinio.on('ready', function(board) {

	console.log('GOT BOARD!!')

	setTimeout(function() {

		console.log('READY!')

		var mockRobot = {
			ready: true,
			board: board,
			handleIRSensor: function() {},
			handleBumper: function() {}
		}

		require(__dirname + '/../bumpers.js').init(mockRobot)
		require(__dirname + '/../forward_distance_sensors.js').init(mockRobot)
	}, 2000)
})