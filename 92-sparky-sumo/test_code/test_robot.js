var Sparky = require('sparky')
var config = require('./../config')

var sparky = new Sparky({
	deviceId: config.DEVICE_ID,
	token: config.ACCESS_TOKEN,
})
var keypress = require('keypress');

// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);

process.stdin.setRawMode(true);

// listen for the "keypress" event
process.stdin.on('keypress', function (ch, key) {
	console.log('Key: ' + key.name);
	if (key.name === 'up') {
		console.log('up!')
		sparky.run('servowrite', 'A0,180');
		sparky.run('servowrite', 'A1,0');
	} else if (key.name === 'down') {
		console.log('down!')
		sparky.run('servowrite', 'A0,0');
		sparky.run('servowrite', 'A1,180');
	} else if (key.name === 'left') {
		console.log('left!')
		sparky.run('servowrite', 'A0,0');
		sparky.run('servowrite', 'A1,0');
	} else if (key.name === 'right') {
		console.log('right!')
		sparky.run('servowrite', 'A0,180');
		sparky.run('servowrite', 'A1,180');
	} else if (key.name === 'return') {
		console.log('stop!')
		sparky.run('servowrite', 'A0,90');
		sparky.run('servowrite', 'A1,90');
	}
});
