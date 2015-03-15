function KeyboardControl() {
	this.start()
}

KeyboardControl.prototype = {

	handleEvent: function(e) {
		switch(e.type) {
			case 'keydown':
				this.handleKeydown(e);
				break;
			case 'keyup':
				this.handleKeyup(e);
				break;
		}
	},

	handleKeydown: function(e) {
		display.innerHTML = 'Control Scheme: Keyboard, Start: ' + e.key;
		if (e.key === currentKey) {
			return;
		}

		currentKey = e.key;

		socket.emit('keybarod:singlekeydown', {
			command: e.key.toLowerCase()
		});
		console.log(e);
	},

	handleKeyup: function(e) {
		display.innerHTML = 'Control Scheme: Keyboard, End: ' + e.key;

		// If the key is different, we assume we're doing something else.
		if (e.key !== currentKey) {
			currentKey = null;
			return;
		}

		currentKey = null;
		socket.emit('keybarod:singlekeyup');
	},

	start: function() {
		document.body.addEventListener('keydown', this);
		document.body.addEventListener('keyup', this);
	},

	stop: function() {
		document.body.removeEventListener('keydown', this);
		document.body.removeEventListener('keyup', this);	
	}
};
