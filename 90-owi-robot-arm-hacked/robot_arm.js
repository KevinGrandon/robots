var pinio = new (require('pinio')).Pinio()
var webSocket = require('ws')
var leapSocket = new webSocket('ws://127.0.0.1:6437')

pinio.on('ready', function(board) {
	var motors = require('./motorconfig').getMotors(board)

	// Wait for potentiometers to read before moving
	setTimeout(init, 2000)

	function init() {
		leapSocket.on('message', function(data, flags) {
			data = JSON.parse(data)
			if (data.pointables && data.pointables.length === 2) {
				var distance = data.pointables[1].tipPosition[0] - data.pointables[0].tipPosition[0]
				var clawGrasp = motors[1]
				console.log('Pointer distance: ', distance)
				clawGrasp.moveTo(distance + 300)
			}
		})
	}

})
