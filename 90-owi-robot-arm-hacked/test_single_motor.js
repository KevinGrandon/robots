var pinio = new (require('pinio')).Pinio()
var Motor = require('./motor').Motor

pinio.on('ready', function(board) {
	var motors = [
		// Base Rotate
		new Motor({
			pot: 'A5',
			min: 450,
			max: 600,
			home: 500,
			dir1: 5,
			dir2: 4
		}, board),
		// Claw Open/Close
		new Motor({
			pot: 'A1',
			min: 300,
			max: 450,
			home: 350,
			dir1: 6,
			dir2: 7
		}, board),
		// Elbow Tilt
		new Motor({
			pot: 'A3',
			/*
			broken, replace pot
			min: 250,
			max: 690,
			home: 505,
			*/
			dir1: 9,
			dir2: 8
		}, board),
		// Claw Up/Down
		new Motor({
			pot: 'A3',
			min: 475,
			max: 675,
			home: 545,
			dir1: 10,
			dir2: 12
		}, board),
		// Shoulder Tilt
		new Motor({
			pot: 'A4',
			/*
			min: 350,
			max: 600,
			home: 512,
			*/
			dir1: 3,
			dir2: 2
		}, board)
	]

	var testMotor = motors[1]

	var keypress = require('keypress');

	// make `process.stdin` begin emitting "keypress" events
	keypress(process.stdin);

	process.stdin.setRawMode(true);

	// listen for the "keypress" event
	process.stdin.on('keypress', function (ch, key) {
        console.log('Key: ' + key.name);
        if (key.name === 'left') {
            console.log('left!')
           	testMotor.ccw()
			setTimeout(function() {
				testMotor.stop()
			}, 200)
        } else if (key.name === 'right') {
           	testMotor.cw()
			setTimeout(function() {
				testMotor.stop()
			}, 200)
        }
	});

})
