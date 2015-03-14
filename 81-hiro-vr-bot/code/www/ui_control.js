/**
 * Handles one key command at a time.
 * We currently only handle one key command at a time to easily
 * throttle messages to the robot to ensure optimal response time.
 */

var socket = io();
var currentKey = null;

var display = document.getElementById('display')

document.body.addEventListener('keydown', e => {
	display.innerHTML = 'Command start: ' + e.key;
	if (e.key === currentKey) {
		return;
	}

	currentKey = e.key;

	socket.emit('start', {
		command: e.key.toLowerCase()
	});
	console.log(e);
});

document.body.addEventListener('keyup', e => {
	display.innerHTML = 'Command end: ' + e.key;

	// If the key is different, we assume we're doing something else.
	if (e.key !== currentKey) {
		currentKey = null;
		return;
	}

	currentKey = null;
	socket.emit('stop');
});

socket.on('bumper', function (data) {
	console.log('Got bumper!', data)
	var bumperEl = document.getElementById('bumper-' + data.pos)
})
