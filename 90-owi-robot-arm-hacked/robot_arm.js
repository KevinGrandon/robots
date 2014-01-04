var pinio = new (require('pinio')).Pinio()
var Motor = require('./motor').Motor
var webSocket = require('ws')
var leapSocket = new webSocket('ws://127.0.0.1:6437')

pinio.on('ready', function(board) {
	var motors = [
		// Base Rotate
		new Motor({
			pot: 'A5',
			min: 360,
			max: 630,
			home: 500,
			dir1: 5,
			dir2: 4
		}, board),
		// Claw Open/Close
		new Motor({
			pot: 'A1',
			min: 350,
			max: 600,
			home: 512,
			dir1: 6,
			dir2: 7
		}, board),
		// Claw Up/Down
		new Motor({
			pot: 'A2',
			min: 250,
			max: 690,
			home: 505,
			dir1: 9,
			dir2: 8
		}, board),
		// Elbow Tilt
		new Motor({
			pot: 'A3',
			min: 450,
			max: 675,
			home: 545,
			dir1: 10,
			dir2: 12
		}, board),
		// Shoulder Tilt
		new Motor({
			pot: 'A4',
			min: 162,
			max: 450,
			home: 350,
			dir1: 3,
			dir2: 2
		}, board)
	]

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
