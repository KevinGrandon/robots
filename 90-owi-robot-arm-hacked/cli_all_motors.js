var pinio = new (require('pinio')).Pinio()

pinio.on('ready', function(board) {
	var motors = require('./motorconfig').getMotors(board)

	var keypress = require('keypress');

	// make `process.stdin` begin emitting "keypress" events
	keypress(process.stdin);

	process.stdin.setRawMode(true);

	var commandMap = {
		q: [4, 'ccw'],
		a: [4, 'cw'],
		w: [1, 'ccw'],
		s: [1, 'cw'],
		e: [2, 'ccw'],
		d: [2, 'cw'],
		r: [0, 'ccw'],
		f: [0, 'cw'],
		t: [3, 'ccw'],
		g: [3, 'cw']
	}

	// listen for the "keypress" event
	process.stdin.on('keypress', function (ch, key) {
        console.log('Key: ' + key.name);
		if (key && key.ctrl && key.name == 'c') {
			console.log("Exiting")
			process.exit()
		}

		// Handle full reset
		if (key.name == 'space') {
			motors.forEach(function(motor) {
				motor.moveTo(motor.home)
			})
			return
		}

		// Motor movement
		var keyConfig = commandMap[key.name]
		var motor = motors[keyConfig[0]]
		motor[keyConfig[1]]()
		setTimeout(function() {
			motor.stop()
		}, 200)
	});

})
