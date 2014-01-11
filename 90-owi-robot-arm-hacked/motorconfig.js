var Motor = require('./motor').Motor

exports.getMotors =  function(board) {
	return [
		// Base Rotate
		new Motor({
			pot: 'A1',
			min: 450,
			max: 600,
			home: 500,
			dir1: 5,
			dir2: 4
		}, board),
		// Shoulder Tilt
		new Motor({
			pot: 'A2',
			min: 450,
			max: 640,
			home: 540,
			dir1: 3,
			dir2: 2
		}, board),
		// Elbow Tilt
		new Motor({
			pot: 'A3',
			min: 475,
			max: 600,
			home: 540,
			dir1: 10,
			dir2: 12
		}, board),
		// Wrist Tilt
		new Motor({
			pot: 'A4',
			min: 570,
			max: 600,
			home: 595,
			dir1: 9,
			dir2: 8
		}, board),
		// Claw Open/Close
		new Motor({
			pot: 'A5',
			min: 250,
			max: 430,
			home: 350,
			dir1: 6,
			dir2: 7
		}, board)
	]
}
