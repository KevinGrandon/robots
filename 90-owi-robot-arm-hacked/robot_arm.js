var pinio = new (require('pinio')).Pinio()

pinio.on('ready', function(board) {

	function Motor(config) {
		this.config = config

		this.pot = board.pins(config.pot)

		this.potAllowance = 2
		this.lastVal = false
		this.pot.read(this.read.bind(this))
	}

	Motor.prototype = {
		/**
		 * Reads the value of the pot
		 */
		read: function(val) {
			if (Math.abs(this.lastVal - val) > this.potAllowance) {
				this.lastVal = val
				console.log(this.config.pot + ' Updated: ' + val)
			}
		}
	}

	var motors = [
		// Base Rotate
		new Motor({
			pot: 'A5',
			min: 360,
			max: 630,
			home: 500
		}),
		// Base Tilt
		new Motor({
			pot: 'A1',
			min: 350,
			max: 600,
			home: 500
		}),
		// Base Up/Down
		new Motor({
			pot: 'A2',
			min: 250,
			max: 690,
			home: 505
		}),
		// Claw Up/Down
		new Motor({
			pot: 'A3',
			min: 450,
			max: 675,
			home: 545
		}),
		// Claw Open/Close
		new Motor({
			pot: 'A4',
			min: 162,
			max: 450,
			home: 350
		})
	]
})
