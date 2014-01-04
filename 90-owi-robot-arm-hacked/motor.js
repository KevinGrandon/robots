var MOTOR_SPEED = 100


function Motor(config, board) {
	this.config = config

	this.min = config.min
	this.max = config.max
	this.home = config.home

	this.pot = board.pins(config.pot)

	this.potAllowance = 2
	this.current = false
	this.pot.read(this.read.bind(this))

	this.dir1 = board.pins(config.dir1)
	this.dir2 = board.pins(config.dir2)
    this.dir2.output()
    this.dir1.output()
}

Motor.prototype = {
	/**
	 * Reads the value of the pot
	 */
	read: function(val) {
		if (Math.abs(this.current - val) > this.potAllowance) {
			this.current = val
			console.log(this.config.pot + ' Updated: ' + val)
			if (this.current > this.config.max) {
				console.log(this.config.pot + ' min limit reached')
				this.stop()
			} else if (this.current < this.config.min) {
				console.log(this.config.pot + ' max limit reached')
				this.stop()
			}

			// If we have reached out tracking
			if (this.trackTo && Math.abs(this.current - this.trackTo) < 10) {
				this.stop()
			}
		}
	},

	/**
	 * Moves the motor clockwise
	 */
	cw: function() {
		console.log('Motor rotating clockwise', this.config.dir2, this.config.dir1)
		this.dir2.high()
		this.dir1.low()
	},

	/**
	 * Moves the motor counter-clockwise
	 */
	ccw: function() {
		console.log('Motor rotating counter-clockwise', this.config.dir2, this.config.dir1)
		this.dir2.low()
		this.dir1.high()
	},

	/**
	 * Attempts to move the motor to a given potentiometer position
	 */
	moveTo: function(pos) {
		if (pos > this.current) {
			console.log("Tracking to CCW: ", this.current, pos)
			this.trackTo = pos
			this.ccw()
		} else if (pos < this.current) {
			console.log("Tracking to CCW: ", this.current, pos)
			this.trackTo = pos
			this.cw()
		}
	},

	/**
	 * Stops the motor
	 */
	stop: function() {
		this.trackTo = false
		this.dir1.output()
		this.dir2.high()
		this.dir1.high()
	},
}

exports.Motor = Motor