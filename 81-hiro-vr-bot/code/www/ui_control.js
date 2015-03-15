/**
 * Handles one key command at a time.
 * We currently only handle one key command at a time to easily
 * throttle messages to the robot to ensure optimal response time.
 */

var socket = io();
var currentKey = null;

var display = document.getElementById('display')

var inputControl = new KeyboardControl()

window.addEventListener('gamepadconnected', function(e) {
	console.log('Gamepad connected at index %d: %s. %d buttons, %d axes.',
		e.gamepad.index, e.gamepad.id, e.gamepad.buttons.length, e.gamepad.axes.length);
	inputControl.stop()
	inputControl = new GamepadControl()
}); 

window.addEventListener('gamepaddisconnected', function(e) {
	console.log('Gamepad disconnected.')
	inputControl.stop()
	inputControl = new KeyboardControl()
}); 


socket.on('bumper:down', function (data) {
	console.log('Got bumper:down', data)
	var bumperEl = document.getElementById('bumper-' + data.pos)
	bumperEl.classList.add('hit')
})

socket.on('bumper:up', function (data) {
	console.log('Got bumper:up', data)
	var bumperEl = document.getElementById('bumper-' + data.pos)
	bumperEl.classList.remove('hit')
})

