var pinio = new (require('pinio')).Pinio()

pinio.on('ready', function(board) {
	var motors = require('./motorconfig').getMotors(board)

	var keypress = require('keypress');

	// make `process.stdin` begin emitting "keypress" events
	keypress(process.stdin);

	process.stdin.setRawMode(true);

	var commandMap = {
		q: [0, 'ccw'],
		a: [0, 'cw'],
		w: [1, 'cw'],
		s: [1, 'ccw'],
		e: [2, 'ccw'],
		d: [2, 'cw'],
		r: [3, 'ccw'],
		f: [3, 'cw'],
		t: [4, 'cw'],
		g: [4, 'ccw']
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
		if (!keyConfig) {
			console.log('could not find command for:', key.name);
			return;
		}

		var motor = motors[keyConfig[0]]
		motor[keyConfig[1]]()
		setTimeout(function() {
			motor.stop()
		}, 200)
	});

})
