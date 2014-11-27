var Motor = require('./motor').Motor

exports.getMotors =  function(board) {
	/*for testing */
	/*
	return [
		new Motor({
			pot: 'A1',
			min: 560,
			max: 590,
			home: 585,
			dir1: 3,
			dir2: 4
		}, board),
	];*/

	return [
		// Base tilt
		new Motor({
			pot: 'A5',
			min: 250,
			max: 430,
			home: 350,
			dir1: 11,
			dir2: 12
		}, board),
		// Shoulder Tilt
		new Motor({
			pot: 'A2',
			min: 450,
			max: 640,
			home: 540,
			dir1: 5,
			dir2: 6
		}, board),
		// Elbow Tilt
		new Motor({
			pot: 'A3',
			min: 475,
			max: 600,
			home: 540,
			dir1: 8,
			dir2: 7
		}, board),
		// Wrist tile, up down.
		new Motor({
			pot: 'A1',
			min: 560,
			max: 590,
			home: 585,
			dir1: 3,
			dir2: 4
		}, board),
		// Claw open/close.
		new Motor({
			pot: 'A4',
			min: 270,
			max: 485,
			home: 385,
			dir1: 9,
			dir2: 10
		}, board),
	]
}
