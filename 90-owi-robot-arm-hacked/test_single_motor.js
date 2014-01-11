var pinio = new (require('pinio')).Pinio()

pinio.on('ready', function(board) {
	var motors = require('./motorconfig').getMotors(board)
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
