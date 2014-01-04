var pinio = new (require('pinio')).Pinio()
var Motor = require('./motor').Motor

pinio.on('ready', function(board) {
	var motors = [
		// Base Rotate
		new Motor({
			pot: 'A5',
			min: 360,
			max: 630,
			home: 500,
			pwmPin: 5,
			dirPin: 4
		}, board),
		// Claw Open/Close
		new Motor({
			pot: 'A1',
			min: 350,
			max: 600,
			home: 512,
			pwmPin: 6,
			dirPin: 7
		}, board),
		// Claw Up/Down
		new Motor({
			pot: 'A2',
			min: 250,
			max: 690,
			home: 505,
			pwmPin: 9,
			dirPin: 8
		}, board),
		// Elbow Tilt
		new Motor({
			pot: 'A3',
			min: 450,
			max: 675,
			home: 545,
			pwmPin: 10,
			dirPin: 12
		}, board),
		// Shoulder Tilt
		new Motor({
			pot: 'A4',
			min: 162,
			max: 450,
			home: 350,
			pwmPin: 3,
			dirPin: 2
		}, board)
	]

	var testMotor = motors[3]

	testMotor.ccw()
	setTimeout(function() {
		testMotor.stop()
	}, 400)
})
