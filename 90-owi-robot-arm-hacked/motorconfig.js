var Motor = require('./motor').Motor

exports.getMotors =  function(board) {
	/* for testing individual motors
	return [
		new Motor({
			pot: 'A4',
			min: 600,
			max: 675,
			home: 635,
			dir1: 10,
			dir2: 9
		}, board),
	];
	//*/

	return [
		// Base tilt
		new Motor({
			pot: 'A5',
			min: 470,
			max: 640,
			home: 555,
			dir1: 11,
			dir2: 12
		}, board),
		// Shoulder Tilt
		new Motor({
			pot: 'A2',
			min: 475,
			max: 600,
			home: 525,
			dir1: 5,
			dir2: 6
		}, board),
		// Elbow Tilt
		new Motor({
			pot: 'A3',
			min: 300,
			max: 540,
			home: 400,
			dir1: 7,
			dir2: 8
		}, board),
		// Wrist tile, up down.
		new Motor({
			pot: 'A4',
			min: 600,
			max: 675,
			home: 635,
			dir1: 10,
			dir2: 9
		}, board),
		// Claw open/close.
		new Motor({
			pot: 'A1',
			min: 520,
			max: 680,
			home: 600,
			dir1: 4,
			dir2: 3
		}, board),
	]
}
