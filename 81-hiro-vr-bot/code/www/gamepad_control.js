function GamepadControl() {
	this._interval = this.interval.bind(this);
	this.start()
}

GamepadControl.prototype = {

	lastLeft: 0,
	lastRight: 0,

	interval: function() {
		var gamepads = navigator.getGamepads()
		for (var i = 0; i < gamepads.length; i++) {
			if (gamepads[i].axes) {
				this.handleAxes(gamepads[i].axes)
			}
		}

	},

	handleAxes: function(axes) {
		// For now just handle tank controls
		var left = Math.round(axes[1] * 100)
		var right = Math.round(axes[3] * 100)

		// If we are within a threshold of the previous value, don't update.
		if (Math.abs(left - this.lastLeft) + Math.abs(right - this.lastRight) < 3) {
			console.log('not much change, returning')
			return
		}

		// If we are close to 0, don't notify the server.
		// Require at least 10% movement.
		if (Math.abs(left) < 10 && Math.abs(right) < 10) {
			console.log('central pos, returning')
			this.lastLeft = left
			this.lastRight = right

			// Notify the server that we've stopped.
			socket.emit('gamepad:tankcontrol:stop');
			return
		}

		this.lastLeft = left
		this.lastRight = right

		display.innerHTML = 'Gamepad Tank Control (L/R): ' + left + ' - ' + right;
		socket.emit('gamepad:tankcontrol:move', {
			left: left,
			right: right
		});
	},

	start: function() {
		setInterval(this._interval, 100)
	},

	stop: function() {
		clearInterval(this._interval, 100)
	}
};
